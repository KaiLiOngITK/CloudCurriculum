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
