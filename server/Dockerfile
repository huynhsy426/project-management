FROM node:18.16.1-alpine
WORKDIR /src
COPY . .
RUN npm install
EXPOSE 8082
CMD ["npm","run", "dev"]