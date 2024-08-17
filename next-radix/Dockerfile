# Use uma imagem oficial do Node.js como base
FROM node:18-alpine

# Defina o diretório de trabalho no contêiner
WORKDIR /app

# Copie os arquivos de dependências para o contêiner
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante dos arquivos da aplicação para o contêiner
COPY . .

# Build da aplicação
RUN npm run build

# Exponha a porta na qual a aplicação será servida
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["npm", "start"]
