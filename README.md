# graphic-cards-case-study

This repository contains a Node.js sample application that is used on this blog post. The blog post
talks about how Auth0 helped a huge graphic cards manufacturer to solve identity management.

## Bootstrapping

```bash
docker build --build-arg app=node-1 -t node-app-1 .
docker build --build-arg app=node-2 -t node-app-2 .

docker run --name node-1 -d -p 3001:3000 node-app-1
docker run --name node-2 -d -p 3002:3000 node-app-2

now -e app="node-1" --docker --public
now -e app="node-2" --docker --public

ACCESS_TOKEN=$(curl --request POST \
  --url https://bkrebs.auth0.com/oauth/token \
  --header 'content-type: application/json' \
  --data '{
    "client_id": "BvEdrxK2T2f36Hnttintbe4yIEjUC5P2",
    "client_secret": "13rf3mN0ciOEckabpE4TF4LYstBfOa19DYUBED7-MMzEM-CjR2ig_kifTfyy3Hoh",
    "audience":"legacy-idp",
    "grant_type":"client_credentials"
}' | jq '.access_token' -r)

curl -H "Authorization: Bearer $ACCESS_TOKEN" https://node-app-1.now.sh/users/serena@spam4.me
curl -H "Authorization: Bearer $ACCESS_TOKEN" https://node-app-2.now.sh/users/venus@spam4.me

curl -X POST -H "Content-Type: application/json" \
 -H "Authorization: Bearer $ACCESS_TOKEN" \
 -d '{
    "email": "bruno@spam4.me",
    "password": "123456"
}' https://node-app-1.now.sh/users/authenticate

curl -X POST -H "Content-Type: application/json" \
 -H "Authorization: Bearer $ACCESS_TOKEN" \
 -d '{
    "email": "venus@spam4.me",
    "password": "123456"
}' https://node-app-2.now.sh/users/authenticate
```

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
ACCESS_TOKEN=$(curl --request POST \
  --url https://bkrebs.auth0.com/oauth/token \
  --header 'content-type: application/json' \
  --data '{
    "client_id": "BvEdrxK2T2f36Hnttintbe4yIEjUC5P2",
    "client_secret": "13rf3mN0ciOEckabpE4TF4LYstBfOa19DYUBED7-MMzEM-CjR2ig_kifTfyy3Hoh",
    "audience":"legacy-idp",
    "grant_type":"client_credentials"
}' | jq '.access_token' -r)

curl -H "Authorization: Bearer $ACCESS_TOKEN" http://localhost:3000/users


curl -X POST -H "Content-Type: application/json" \
 -H "Authorization: Bearer $ACCESS_TOKEN" \
 -d '{
    "email": "bruno@spam4.me",
    "password": "123456"
}' http://localhost:3000/users/authenticate
```