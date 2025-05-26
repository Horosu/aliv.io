from fastapi import APIRouter, Depends
from app.models.registro_humor import HumorEntrada, HumorSaida
from app.services import humor_service
from app.auth.dependencias import usuario_autenticado

router = APIRouter(prefix="/humor", tags=["Humor"])

@router.post("/", response_model=HumorSaida)
async def registrar_humor(
    dados: HumorEntrada,
    id_usuario: str = Depends(usuario_autenticado)
):
    dados.id_usuario = id_usuario
    return await humor_service.registrar_humor(dados)

@router.get("/", response_model=list[HumorSaida])
async def listar_humores(id_usuario: str = Depends(usuario_autenticado)):
    return await humor_service.listar_humores(id_usuario)
