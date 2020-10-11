FROM node:14

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --prod

COPY dist example/input_file.csv ./

USER node

CMD [ "node", "src/cli/index.js", "input_file.csv" ]
