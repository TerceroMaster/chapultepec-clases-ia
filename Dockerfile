FROM nginx:alpine

# Configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos estáticos de la plataforma
COPY . /usr/share/nginx/html

# Script de entrada para inyectar variables de entorno en tiempo de ejecución
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
