FROM node:16-alpine

WORKDIR /app

# Production
# RUN npm install -g pm2

# copy package.json file and RUN npm install before COPY . .
# so the Docker can cache this layer even we have changed the source code
COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

# Production
# RUN npm install --production --silent

COPY . .

# Development
CMD ["npm", "start"]

# Production
# CMD ["pm2-runtime", "ecosystem.config.js", "--env", "production"]