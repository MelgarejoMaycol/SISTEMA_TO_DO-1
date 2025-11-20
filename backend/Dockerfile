# Imagen base de Python
FROM python:3.11

# Configurar variables de entorno
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivo de dependencias
COPY requirements.txt /app/

# Instalar dependencias
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copiar los archivos del proyecto
COPY . /app/

# Copiar y dar permisos al script de entrada
COPY entrypoint.sh /app/
RUN chmod +x /app/entrypoint.sh

# Exponer el puerto 8000
EXPOSE 8000

# Ejecutar el script de entrada
ENTRYPOINT ["/app/entrypoint.sh"]
