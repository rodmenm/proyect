# Usa una imagen base con Node.js
FROM node:12.18.1-slim

# Establece el directorio de trabajo en la aplicación
WORKDIR /usr/src/app

# Copia el archivo package.json e package-lock.json (si existen)
COPY server .

# Instala las dependencias
RUN npm install

# Expone el puerto en el que el servidor estará escuchando
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
