#!/bin/sh

echo "Esperando a que la base de datos esté lista..."
sleep 5

echo "Aplicando migraciones..."
python manage.py migrate --noinput

echo "Iniciando servidor..."
exec python manage.py runserver 0.0.0.0:8000
