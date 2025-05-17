# Usa Node.js 22 como base
FROM node:22

# Instala ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Crea directorio de trabajo
WORKDIR /app

# Copia package.json y package-lock.json
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto del proyecto
COPY . .

# Expone el puerto que usará Render (por defecto es 3000)
EXPOSE 3000

# Comando que ejecuta migraciones y arranca el servidor
CMD ["npm", "start"]
