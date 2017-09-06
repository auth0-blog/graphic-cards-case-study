# graphic-cards-case-study

This repository contains a Node.js sample application that is used on this blog post. The blog post
talks about how Auth0 helped a huge graphic cards manufacturer to solve identity management.

## Bootstrapping with Docker Compose

The sample application used in the blog post is run twice to simulate different apps with their own users. To 
facilitate the process, we will use `docker-compose` to bootstrap two different MySQL instances and two different
instances of the Node.js app. The following commands start everything:

```bash
docker-compose build
docker-compose up
```

To stop, remove, and clean everything, we can run the following commands:

```bash
docker stop gcards_node-2_1 gcards_node-1_1 gcards_mysql-2_1 gcards_mysql-1_1 gcards_nginx_1

docker rm gcards_node-2_1 gcards_node-1_1 gcards_mysql-2_1 gcards_mysql-1_1 gcards_nginx_1

docker network rm gcards_default
```

## Running the App

To start the application without `docker-compose`, we must run the following commands:

```bash
docker run --name mysql \
    -p 3306:3306 \
    -e MYSQL_ROOT_PASSWORD=myextremellysecretpassword \
    -e MYSQL_DATABASE=node-1 \
    -e MYSQL_USER=app-mysql \
    -e MYSQL_PASSWORD=mysecretpassword \
    -d mysql:5.7

docker build -t node-app .

docker run --name node -d -p 3001:3000 node-app
```

To stop, remove, and clean everything, we can run the following commands:

```bash
docker stop mysql node
docker rm mysql node
```

## Interacting with the API

```bash
curl http://localhost:3000/users

curl http://localhost:3000/users/2

curl -X POST -H "Content-Type: application/json" -d '{
    "username": "bruno",
    "password": "123456"
}' http://localhost:3000/users/authenticate
```