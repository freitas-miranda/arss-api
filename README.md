# ARSS - API
> Backend do sistema ARSS

## Ambiente
 - Node.js 12.x
 - Yarn
 - PM2

## Desenvolvimento
```bash
# Clonar o repositório
git clone -b develop git@github.com:freitas-miranda/arss-api.git

# Entre no diretório raiz
cd arss-api

# Configure o ambiente
# Já possui acesso a um banco de desenvolvimento
cp .env.example .env

# Buildar o projeto
yarn && yarn lint && yarn build

# Subir o servidor
yarn dev
```

## Implantação
```bash
# Acessar a VM de produção
ssh root@www.arss.link

# Ir para servidores
cd /servidores

# Clonar o repositório
git clone -b main --single-branch --no-tags git@github.com:freitas-miranda/arss-api.git

# Entrar no repositório
cd arss-api/

# Configurar o ambiente
vi .env

# Buildar a aplicação
yarn && yarn build

# Subir o serviço
pm2 start ecosystem.config.js --env production

# Salvar configuração do PM2
pm2 startup && pm2 save

```

## Atualização
```bash
# Fazer o merge na main

# Acessar a vm de produção
ssh root@arss.link

# Ir para servidores
cd /servidores/arss-api

# Atualizar arquivos
git pull

# Buildar a aplicação
yarn && yarn build

# Reiniciar o serviço
pm2 reload arss-api --update-env

# Parar o serviço
pm2 stop arss-api

# Deletar o serviço
pm2 delete arss-api

```

## Versionamento
```bash
# Acessar a VM de produção
ssh root@www.arss.link

# Ir para servidores
cd /servidores/arss-api

# Atualizar o repositório
git pull

# Buildar a aplicação
yarn && yarn build

# Reiniciar o serviço
pm2 reload arss-api --update-env

```
