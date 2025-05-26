from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.security import OAuth2PasswordRequestForm
from app.models.modelo_usuario import UsuarioEntrada, UsuarioLogin, UsuarioSaida
from app.services import usuario_service
from app.auth.jwt import criar_token, obter_usuario_logado
import os

router = APIRouter(prefix="/usuarios", tags=["Usuários"])


@router.get("/ping")
async def verificar_conexao():
    return {"mensagem": "rota de usuários está ativa"}


@router.post("/registrar", response_model=UsuarioSaida)
async def registrar_usuario(dados: UsuarioEntrada):
    try:
        novo_usuario = await usuario_service.criar_usuario(dados)
        return novo_usuario
    except ValueError as erro:
        raise HTTPException(status_code=400, detail=str(erro))


@router.post("/entrar")
async def login_usuario(formulario: OAuth2PasswordRequestForm = Depends()):
    dados = UsuarioLogin(email=formulario.username, senha=formulario.password)
    usuario = await usuario_service.autenticar_usuario(dados)
    if not usuario:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    token = criar_token({"sub": usuario.id})
    return {"token": token, "tipo": "bearer"}


@router.get("/me", response_model=UsuarioSaida)
async def obter_me(usuario=Depends(obter_usuario_logado)):
    return usuario


@router.post("/foto")
async def atualizar_foto_perfil(
    arquivo: UploadFile = File(...),
    usuario=Depends(obter_usuario_logado)
):
    pasta_destino = "static/perfis"
    os.makedirs(pasta_destino, exist_ok=True)

    extensao = os.path.splitext(arquivo.filename)[1]
    caminho_arquivo = os.path.join(pasta_destino, f"{usuario.id}{extensao}")

    with open(caminho_arquivo, "wb") as buffer:
        buffer.write(await arquivo.read())

    url_publica = f"/static/perfis/{usuario.id}{extensao}"
    await usuario_service.atualizar_foto(usuario.id, url_publica)

    return {"fotoPerfil": url_publica}
