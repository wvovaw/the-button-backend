ARG NODE_VERSION=19
FROM node:$NODE_VERSION
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . .
EXPOSE 7000
RUN yarn build
RUN yarn db:gen
CMD ["yarn", "start"]
