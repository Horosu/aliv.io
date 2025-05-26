from datetime import datetime, timedelta
from typing import Optional

from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from app.config import settings
from app.services.usuario_service import buscar_por_id
from app.models.modelo_usuario import UsuarioSaida

ALGORITMO = "HS256"
EXPIRA_EM_MINUTOS = 60

oauth2_esquema = OAuth2PasswordBearer(tokenUrl="/usuarios/entrar")


def criar_token(dados: dict) -> str:
    dados_para_token = dados.copy()
    expiracao = datetime.utcnow() + timedelta(minutes=EXPIRA_EM_MINUTOS)
    dados_para_token.update({"exp": expiracao})
    token_jwt = jwt.encode(dados_para_token, settings.SECRET_KEY, algorithm=ALGORITMO)
    return token_jwt


def verificar_token_puro(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITMO])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )


verificar_token = verificar_token_puro


async def obter_usuario_logado(token: str = Depends(oauth2_esquema)) -> UsuarioSaida:
    payload = verificar_token_puro(token)
    usuario_id: str = payload.get("sub")

    if not usuario_id:
        raise HTTPException(status_code=401, detail="Token sem ID de usuário")

    usuario = await buscar_por_id(usuario_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    return usuario
