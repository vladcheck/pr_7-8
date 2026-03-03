FROM node:24-alpine3.23

ENV port=3000

COPY package.json package.json
COPY pnpm-lock.yaml pnpm-lock.yaml
RUN npm update -g npm && npm install

COPY . .

EXPOSE ${port}
CMD [ "npm", "run", "dev" ]
