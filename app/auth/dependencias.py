from fastapi import Depends
from app.auth.jwt import verificar_token

async def usuario_autenticado(dados_token: dict = Depends(verificar_token)):
    return dados_token.get("sub")
