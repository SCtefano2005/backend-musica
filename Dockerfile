# Usa Node.js 22 como base oficial
FROM node:22

# Instala ffmpeg (para procesamiento de audio/video)
RUN apt-get update && apt-get install -y ffmpeg && apt-get clean && rm -rf /var/lib/apt/lists/*

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia solo los archivos de dependencias primero para aprovechar el cache
COPY package*.json ./

# Instala las dependencias definidas en package.json
RUN npm install --production

# Copia el resto del código fuente al contenedor
COPY . .

# Expone el puerto que la app usará (por defecto 3000 en Render)
EXPOSE 3000

# Establece la variable de entorno NODE_ENV a producción
ENV NODE_ENV=production

# Comando para ejecutar migraciones y luego arrancar el servidor
CMD ["npm", "start"]
