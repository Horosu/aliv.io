from pydantic import BaseModel, EmailStr
from typing import Optional

class UsuarioEntrada(BaseModel):
    email: EmailStr
    senha: str
    nome: str

class UsuarioLogin(BaseModel):
    email: EmailStr
    senha: str

class UsuarioSaida(BaseModel):
    id: Optional[str]
    email: EmailStr
    nome: str
    foto_perfil: Optional[str] = None
