FROM node:12.14.1-alpine3.11
WORKDIR /usr/src/app
COPY package.json .
# For npm@5 or later, copy package-lock.json as well
# COPY package.json package-lock.json .
RUN npm install
COPY . .
CMD [ "node", "index" ]