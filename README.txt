# MovieMatch

App que mostra filmes populares um por um (dados vindos do TMDB) e deixa o usuário votar com 👍 ou 👎. Depois de 10 votos, mostra um resumo com os gêneros que mais bateram, os filmes curtidos e sugere um próximo filme baseado nesse histórico.

---

## Stack
- **Back-end:** Python 3.12, Flask, SQLAlchemy, SQLite, Flask-CORS
- **Front-end:** HTML, CSS e JavaScript puro
- **API externa:** [TMDB](https://www.themoviedb.org/)

---

## Estrutura do projeto

MovieMatch/ ├── app/ │ ├── init.py # Inicializa o Flask e o banco │ ├── models.py # Entidade Vote (SQLAlchemy) │ ├── routes.py # Endpoints da API REST │ └── tmdb_service.py # Chamadas à API do TMDB ├── static/ │ ├── script.js # Lógica do front-end │ └── style.css # Estilização ├── templates/ │ └── index.html # Interface principal ├── config.py # Configurações e variáveis de ambiente ├── run.py # Ponto de entrada da aplicação ├── requirements.txt # Dependências do projeto └── .env # Variáveis de ambiente (não versionado)


---

## Como rodar o projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/MovieMatch.git
cd MovieMatch
```

### 2. Criar o ambiente virtual
```bash
python3 -m venv .venv
```

### 3. Ativar o ambiente virtual

**Linux/macOS:**
```bash
source .venv/bin/activate
```

**Windows (cmd):**
```cmd
.venv\Scripts\activate.bat
```

**Windows (PowerShell):**
```powershell
.venv\Scripts\Activate.ps1
```

> No PowerShell, se der erro de permissão, rode antes: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

### 4. Instalar as dependências
```bash
pip install -r requirements.txt
```

### 5. Configurar o arquivo `.env`
Crie um arquivo `.env` na raiz do projeto:

TMDB_API_KEY=seu_token_aqui

> O token é o **API Read Access Token** (começa com `eyJ`), disponível em [themoviedb.org](https://www.themoviedb.org/) → Configurações → API.

### 6. Rodar o servidor

**Linux/macOS:**
```bash
python3 run.py
```

**Windows:**
```cmd
python run.py
```

### 7. Acessar no navegador

http://localhost:5000


---

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/film/random` | Retorna um filme aleatório e bem avaliado |
| `POST` | `/api/votes` | Salva o voto do usuário |
| `GET` | `/api/liked-films` | Retorna os filmes curtidos |
| `GET` | `/api/recommendations` | Retorna uma recomendação baseada nos curtidos |

### Exemplo de body para `POST /api/votes`
```json
{
  "film_id": 238,
  "title": "O Poderoso Chefão",
  "synopsis": "...",
  "cover": "https://image.tmdb.org/t/p/w500/...",
  "liked": true,
  "genre_ids": [18, 80]
}
```

---

## Autor
Erick Klava de Oliveira-2022100432
Pedro Maciel Dantas Milck-2022100318
