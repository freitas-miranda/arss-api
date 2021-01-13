# ARSS - API

## Requisitos

### Pré-requisitos

- Node.js 10+
- yarn
- npm >= 6.x

### Banco de Dados

- MariaDB >= 10.x

### Instalando

``` bash
# Clone o repositório:
git clone -b develop git@github.com:freitas-miranda/arss-api.git

# Acesse o diretório do projeto:
cd arss-api

# Crie o arquivo para as váriaveis de ambiente:
cp .env.example .env

# Configure as váriaveis de ambiente:
APP_KEY=node // Chave de criptografia do aplicativo
APP_PORT=node // Porta que a API vai escutar
CLIENT_PORT=80 // Porta da aplicação cliente
NODE_ENV=production // production ou development

// MariaDB
DB_HOST=localhost // Host onde está o banco de dados
DB_DATABASE=node // Nome da base de dados
DB_USERNAME=node // Usuário
DB_PASSWORD=node // Senha de acesso

// EMAIL
EMAIL_SMTP=smtp.office365.com
EMAIL_PORT=587
EMAIL_USER=node // Seu e-mail office
EMAIL_PASS=node // Sua senha
EMAIL_FROM=node // Seu e-mail office

# Instale as denpedências:
yarn && yarn build-win

# Inicialize o servidor:
yarn dev
```

