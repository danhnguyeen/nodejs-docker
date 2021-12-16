#Dockerize Node.js E-Commerce App - NodeJS Mongo Mongo-Express Redis

###Build Image
`docker build -t e-commerce-nodejs-app:v1 .`
- `-t image-name`
- `v1` is image tag, default is `latest`
- `.` build image on current folder, Docker will find the `Dockerfile` on the current folder

###Run Docker Image
- `docker-compose up`
- run http://localhost:3000 and enjoy :)
- run http://localhost:8081 mongo-express


###Build Production Image
- Update `.dockerignore` file
- Update Dockerfile
- `docker build -t e-commerce-nodejs-app:production .`
- `docker tag e-commerce-nodejs-app:production registry.gitlab.com/danhnguyeen/learning-docker:node_mongo_redis_production`
- `docker push registry.gitlab.com/danhnguyeen/learning-docker:node_mongo_redis_production`

###Deploy
- Update `docker-compose.yml` and `.env`
- `docker-compose up`
- run http://localhost:3000 and enjoy :)