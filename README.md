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


###Build Production Image with Nonr-root user
- `id -u` -----> 501
- `id -g` -----> 20
- Update `Dockerfile`
```
RUN addgroup -g 20 appgroup
RUN adduser -D -u 501 appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser
```
If it throws error `gid 20 in use`:
- Disable the above `addgroup` command
- Rebuild docker and run `docker-compose up -d` or `docker build --no-cache --progress=plain -t e-commerce-nodejs-app:v1 .`
- Run `docker-compose exec app sh`
- Run `cat /etc/group` then find the group ID 20 => the user is `dialout:x:20:root`
- Run `docker-compose down`
- Then update Dockerfile with `dialout` user group
- `docker build -t e-commerce-nodejs-app:deploy-node .`
- Update UID:GID on `docker-compose.yml` for Mongo and Redis

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