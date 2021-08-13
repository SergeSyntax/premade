FROM node:alpine

# Add the following line to solve https://github.com/facebook/create-react-app/issues/8688
ENV CI=true

WORKDIR /app
COPY ./package.json ./
RUN npm install

COPY ./ ./

CMD [ "npm", "start"]