# graphic-cards-case-study
How Auth0 helped a huge graphic cards manufacturer to solve identity

```bash
docker build -t node-app .

docker run --name app-1-mysql -d -p 3001:3000 node-app

docker run --name mysql \
    -p 3306:3306 \
    -e MYSQL_ROOT_PASSWORD=myextremellysecretpassword \
    -e MYSQL_DATABASE=node-1 \
    -e MYSQL_USER=app-mysql \
    -e MYSQL_PASSWORD=mysecretpassword \
    -d mysql:5.7
```

```bash
docker stop gcards_node-2_1 gcards_node-1_1 gcards_mysql-2_1 gcards_mysql-1_1

docker rm gcards_node-2_1 gcards_node-1_1 gcards_mysql-2_1 gcards_mysql-1_1

ocker network rm gcards_default
```