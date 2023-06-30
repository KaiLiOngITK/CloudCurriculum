# CloudCurriculum
Cloud Curriculum Level 1 -- May 2023

## Week 1:
### User Management Services
How to run services:
```
docker build -t user-services:v1 .\user-services\
docker run -p 8080:8080 -d user-services:v1
```
### Product Catalog Services
How to run services:
```
docker build -t product-services:v1 .\product-services\
docker run -p 8081:8081 -d product-services:v1
```

### Order Services
How to run services:
```
docker build -t order-services:v1 .\order-services\
docker run -p 8082:8082 -d order-services:v1
```



## Week 2: Added Database (MongoDB & Postgres)
### Run services with docker-compose.yml
```
docker compose up --build
```
To remove services:
```
docker compose down
```

## Week 3: Added nginx.conf for reversing the proxy
Reference/ tutorial : https://www.bogotobogo.com/DevOps/Docker/Docker-Compose-Nginx-Reverse-Proxy-Multiple-Containers.php

## Week 4: Added rabbitmq for publish and subscribe
```
rabbitmq:
    image: rabbitmq:3.8-management-alpine
    ports:
      - 5672:5672
      - 15672:15672
```
## Week 5: Added to Azure (deleted on azure)
The service created in azure : onk1frcloudcurriculum
```
docker login onk1frcloudcurriculum.azurecr.io
docker tag cloudcurriculum-order-services onk1frcloudcurriculum.azurecr.io/cloudcurriculum-order-services
docker push onk1frcloudcurriculum.azurecr.io/cloudcurriculum-order-services
```
