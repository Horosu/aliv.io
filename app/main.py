from fastapi import FastAPI
from app.routes import usuario_routes, humor_routes, ia_routes

app = FastAPI(title="Aliv.io API")

app.include_router(usuario_routes.router)
app.include_router(humor_routes.router)
app.include_router(ia_routes.router)

@app.get("/")
async def raiz():
    return {"mensagem": "API Aliv.io está funcionando"}
