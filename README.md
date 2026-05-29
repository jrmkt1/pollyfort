# Polly Fort Rodas

Site e catalogo de produtos da Polly Fort Rodas, construido com React, Vite, Express e TypeScript.

## Estrutura

```text
assets/images/       Imagens fixas do site, como logo e banners
client/              Aplicacao React
data/                Arquivos de dados importados
server/              API Express e rotas administrativas
shared/              Schemas e tipos compartilhados
uploads/             Uploads locais de produtos
dist/                Build gerado localmente
```

## Comandos

```bash
npm install
npm run dev
npm run build
npm run start
npm run check
```

## Desenvolvimento

O servidor local roda pela API Express e entrega o frontend pelo Vite.

```bash
npm run dev
```

Acesse:

```text
http://localhost:5000
```

## Producao

Gere o build antes de publicar:

```bash
npm run build
```

O build cria:

```text
dist/index.js
dist/public/
```

Esses arquivos sao os artefatos usados para publicar o site em hospedagem Node/Passenger.
