FROM node:16-alpine

WORKDIR /app

COPY . .

RUN npm install

# Development
CMD ["npm", "start"]

# Production
# RUN npm install -g pm2
# CMD ["pm2-runtime", "ecosystem.config.js", "--env", "production"]