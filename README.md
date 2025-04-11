# FreedomCenter Assesment

This is a backend-focused test project using NestJS and Docker for technical knowledge testing. Based on a task-based framework for standard users and administrators. The project follows a basic standard folder structures, including dirs like `common` to share different elements and other modules.

## Some Features

- Postgres SQL connection
- API Documentation with Swagger
- API loggin to watch methods and requests
- Filters for handling Exceptions
- Multer to support image uploads
- Dockerized for easy setup with compose
- Role protected and authorization

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/kur0bai/freedomcenter-assesment.git
cd freedomcenter-assesment
```

### 2. Start with docker

Be sure you have the docker core and cli installed, running in your machine:

In linux: `sudo systemctl status docker` or you can watch docker desktop on windows then run:

```
docker compose up --build -d
docker compose logs -f  #optional for watching logs of the running server
```

### Notes:

You can run it too in a traditional way but I recommend docker (that's the point of the assesment).
Additional automated a dir creation for the uploads in task (multer) so please, check if the folder creates correctly.
I avoid to join some guards, just to split the logic and being more readable. And I also included a middleware to catch some request and response time:

![enter image description here](https://i.imgur.com/t7NcUQM.png)

### Enviroment variables:

```
JWT_SECRET=my_super_secret_key
JWT_EXPIRATION=3600s
POSTGRES_USER=nest
POSTGRES_PASSWORD=nest
POSTGRES_DB=freedomcenter-assesment
POSTGRES_PORT=5432
POSTGRES_HOST=postgres
```

This should work!
Please, feel free to leave a comment or feedback if need it.
