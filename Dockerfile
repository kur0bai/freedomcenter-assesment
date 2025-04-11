FROM node:23-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# for upload files
RUN mkdir -p ./uploads/tasks

CMD ["npm", "run", "start:dev"]
