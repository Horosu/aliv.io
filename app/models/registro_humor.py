from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class HumorEntrada(BaseModel):
    id_usuario: str
    humor: str
    observacao: Optional[str] = None

class HumorSaida(BaseModel):
    id: str
    id_usuario: str
    humor: str
    observacao: Optional[str]
    data_hora: datetime
