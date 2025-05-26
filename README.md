# 🌱 Aliv.io

**Aliv.io** é um aplicativo de **saúde mental** desenvolvido com o objetivo de oferecer suporte emocional, registrar o estado de humor diário do usuário e proporcionar momentos de relaxamento. O app utiliza **Inteligência Artificial (IA)** para conversar com o usuário e conta com um sistema lúdico de autocuidado, representado pelo personagem **Lume**.

---

## 📱 Funcionalidades Principais

### 💬 Sessão com IA
- Converse com uma IA empática treinada para reconhecer sentimentos.
- A IA responde com base no contexto completo da conversa.
- Intents positivas e negativas foram cuidadosamente elaboradas.
- Frases de acolhimento e prevenção ao suicídio estão incluídas.

### 😄 Registro de Humor
- Interface simples para registrar o humor em uma escala de 1 a 5.
- Histórico de humor semanal com média visual em barra.
- Registro salvo localmente ou via API autenticada.

### 🧘 Modo Relaxar
- Acesso rápido via botão SOS emocional.
- Sons relaxantes (músicas fornecidas pelo usuário).
- Animação de respiração guiada.
- Frases calmas e animação do quarto escurecendo com filtro suave.
- Elementos visuais ajustados com contraste agradável.

### 🧒 Personagem Lume
- Mascote virtual que simboliza seu estado emocional.
- Interage com o usuário de forma lúdica.
- Trocável de lugar na interface com elementos dinâmicos.

### 🧑 Perfil do Usuário
- Foto de perfil personalizada (com upload via backend).
- Nome real exibido com base no JWT de autenticação.
- Persistência de dados entre sessões.

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia       | Descrição                           |
|------------------|-------------------------------------|
| React Native + Expo | Frontend mobile cross-platform     |
| FastAPI          | Backend robusto com autenticação    |
| MongoDB          | Banco de dados não relacional       |
| Celery + RabbitMQ | Fila de tarefas assíncronas        |
| Ollama           | Backend de IA local com contexto    |
| Tailwind + Shadcn (UI web preview) | Para protótipos ou painel admin futuro |

---

## 🔐 Autenticação e Segurança

- Sistema de login e registro com JWT.
- Verificação de e-mail e nome via payload seguro.
- Upload de imagem de perfil com validação por token.

---

## 📁 Estrutura do Projeto

alivio-app/
├── src/
│ ├── telas/
│ │ ├── Sessao.js
│ │ ├── RegistrarHumor.js
│ │ ├── ModoRelaxar.js
│ │ └── Perfil.js
│ ├── contexto/
│ ├── navegacao/
│ └── servicos/
└── assets/


---

## 🚧 Status do Projeto

> O projeto ainda está em desenvolvimento. Embora licenciado sob MIT, **o repositório está privado** e não está pronto para uso público.

---

## 📜 Licença

Este projeto está licenciado sob a **Licença MIT** – veja o arquivo [`LICENSE`](LICENSE) para mais detalhes.

---

## 👤 Desenvolvedor

**Guilherme Gonçalves Bispo**  
Estudante de Ciência da Computação  
Repositório mantido individualmente como projeto de disciplina (Projeto Integrador I).

---

## 📌 Objetivos Educacionais

- Aplicar conceitos de desenvolvimento fullstack moderno.
- Explorar uso de IA integrada com frontend mobile.
- Promover reflexão e atenção à saúde mental com responsabilidade.

---

