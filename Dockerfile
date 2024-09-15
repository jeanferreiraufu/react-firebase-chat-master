# Estagio 1 - Será responsavel em construir nossa aplicação
FROM node

WORKDIR /app

COPY package*.json /app/

RUN npm i npm@latest -g

RUN npm install

COPY ./ /app/

ARG env=prod

RUN npm run build --output-path=./ARRS --env $prod

# Estagio 2 - Será responsavel por expor a aplicação
FROM nginx

COPY ./ARRS /usr/share/nginx/html

COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf

#docker build -t arrs_web:prod .
#docker build -t arrs_web:dev --build-arg env="" .
#docker run -p 80:80 arrs_web:prod
