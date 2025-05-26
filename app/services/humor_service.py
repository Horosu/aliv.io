from app.models.registro_humor import HumorEntrada, HumorSaida
from app.config import settings
from motor.motor_asyncio import AsyncIOMotorClient
from bson.objectid import ObjectId
from datetime import datetime

cliente = AsyncIOMotorClient(settings.MONGO_URI)
banco = cliente[settings.DB_NAME]
colecao_humores = banco["humores"]

async def registrar_humor(dados: HumorEntrada) -> HumorSaida:
    documento = dados.dict()
    documento["data_hora"] = datetime.utcnow()
    resultado = await colecao_humores.insert_one(documento)
    return HumorSaida(id=str(resultado.inserted_id), **documento)

async def listar_humores(id_usuario: str) -> list[HumorSaida]:
    cursor = colecao_humores.find({"id_usuario": id_usuario}).sort("data_hora", -1)
    registros = []
    async for doc in cursor:
        registros.append(HumorSaida(
            id=str(doc["_id"]),
            id_usuario=doc["id_usuario"],
            humor=doc["humor"],
            observacao=doc.get("observacao"),
            data_hora=doc["data_hora"]
        ))
    return registros
