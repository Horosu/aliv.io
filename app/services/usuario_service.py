from app.models.modelo_usuario import UsuarioEntrada, UsuarioLogin, UsuarioSaida
from app.config import settings
from motor.motor_asyncio import AsyncIOMotorClient
from bson.objectid import ObjectId
import hashlib

cliente: AsyncIOMotorClient | None = None

def get_colecao_usuarios():
    global cliente
    if not cliente:
        cliente = AsyncIOMotorClient(settings.MONGO_URI)
    banco = cliente[settings.DB_NAME]
    return banco["usuarios"]

def hash_senha(senha: str) -> str:
    return hashlib.sha256(senha.encode()).hexdigest()

async def criar_usuario(dados: UsuarioEntrada) -> UsuarioSaida:
    colecao = get_colecao_usuarios()
    existente = await colecao.find_one({"email": dados.email})
    if existente:
        raise ValueError("Já existe um usuário com este e-mail.")

    usuario = dados.dict()
    usuario["senha"] = hash_senha(usuario["senha"])
    usuario["foto_perfil"] = None
    resultado = await colecao.insert_one(usuario)
    return UsuarioSaida(
        id=str(resultado.inserted_id),
        email=dados.email,
        nome=dados.nome,
        foto_perfil=None
    )

async def autenticar_usuario(dados: UsuarioLogin) -> UsuarioSaida | None:
    colecao = get_colecao_usuarios()
    senha_hashed = hash_senha(dados.senha)
    usuario = await colecao.find_one({
        "email": dados.email,
        "senha": senha_hashed
    })

    if not usuario:
        return None

    return UsuarioSaida(
        id=str(usuario["_id"]),
        email=usuario["email"],
        nome=usuario["nome"],
        foto_perfil=usuario.get("foto_perfil")
    )

async def buscar_por_id(usuario_id: str) -> UsuarioSaida | None:
    colecao = get_colecao_usuarios()
    usuario = await colecao.find_one({"_id": ObjectId(usuario_id)})
    if not usuario:
        return None

    return UsuarioSaida(
        id=str(usuario["_id"]),
        email=usuario["email"],
        nome=usuario["nome"],
        foto_perfil=usuario.get("foto_perfil")
    )

async def atualizar_foto(usuario_id: str, caminho: str):
    colecao = get_colecao_usuarios()
    await colecao.update_one(
        {"_id": ObjectId(usuario_id)},
        {"$set": {"foto_perfil": caminho}}
    )
