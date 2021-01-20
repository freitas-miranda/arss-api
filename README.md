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
cp .env.example .env

# Buildar o projeto
yarn && yarn lint && yarn build-win

# Subir o servidor
yarn dev
```

## Gerar a Imagem Docker
```bash
# Subir o serviço do docker na máquina de desenvolvimento

# Buildar o projeto
yarn && yarn lint && yarn build-win

# Remover a imagem antiga
docker images
docker image rm freitasmiranda/arss-api

# Gerar a imagem docker (Deve ser o .env de produção)
docker build -t freitasmiranda/arss-api .

# Fazer login docker
docker login || docker logout

# Enviar a imagem para DockerHub
docker push freitasmiranda/arss-api

```

## Subir a Imagem Docker
```bash
# Acessar a VM de produção
ssh root@www.arss.link

# Fazer login docker
docker login

# Baixar imagem
docker pull freitasmiranda/arss-api

# Subir container
docker run --name ARSS_API_C1 --restart always -p 3000:80 -e TZ=America/Porto_Velho -d freitasmiranda/arss-api

# Lista de containers
docker container ls -a

# Parar o container
docker container stop ARSS_API_C1

# Excluír todos containers parados
docker container prune

# Lista das imagens
docker images

# Excluír imagens
docker image rm freitasmiranda/arss-api

```
