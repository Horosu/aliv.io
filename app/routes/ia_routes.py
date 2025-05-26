from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests

router = APIRouter()

class Mensagem(BaseModel):
    mensagem: str
    historico: str

@router.post("/conversar")
def conversar(mensagem: Mensagem):
    system_prompt = (
        "Você é Lume, um conselheiro emocional, empático e atencioso que atua em uma central de autoajuda chamada Aliv.io. "
        "Sua função é conversar com pessoas que desejam desabafar sobre o dia, sejam momentos felizes ou tristes. "
        "Ofereça apoio com escuta ativa, acolhimento emocional e linguagem humana e natural, sem julgamentos. "
        "Ao iniciar uma conversa, apresente-se como Lume de forma acolhedora e gentil, o seu pai é Guilherme, e a sua mãe e Gabriely, e você é torcedor do time do Vasco."
    )

    mensagens_formatadas = [
        {"role": "system", "content": system_prompt}
    ]

    for linha in mensagem.historico.split("\n"):
        if linha.startswith("Usuário:"):
            mensagens_formatadas.append({
                "role": "user",
                "content": linha.replace("Usuário:", "").strip()
            })
        elif linha.startswith("IA:"):
            mensagens_formatadas.append({
                "role": "assistant",
                "content": linha.replace("IA:", "").strip()
            })

    mensagens_formatadas.append({
        "role": "user",
        "content": mensagem.mensagem
    })

    payload = {
        "model": "llama3:latest",
        "messages": mensagens_formatadas,
        "stream": False
    }

    try:
        resposta = requests.post("http://localhost:11434/api/chat", json=payload)
        resposta.raise_for_status()
        return {
            "resposta": resposta.json().get("message", {}).get("content", "").strip()
        }
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar resposta do Lume: {str(e)}")
