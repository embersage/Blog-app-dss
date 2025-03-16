# Запуск проекта

## Первый способ:

1. Открыть в терминале /gateway, выполнить команду npm i, затем команду npm run dev. Также нужен .env файл в папке gateway с содержимым:
   DB_HOST = localhost
   DB_PORT = 5432
   DB_USER = postgres
   DB_PASSWORD = root
   DB_NAME = postgres
   SECRET_KEY = secret_key

2. Открыть в терминале /post-service, выполнить команду npm i, затем команду npm run dev. Также нужен .env файл в папке post-service с содержимым:
   DB_HOST = localhost
   DB_PORT = 5432
   DB_USER = postgres
   DB_PASSWORD = root
   DB_NAME = postgres
   SECRET_KEY = secret_key

3. Открыть в терминале /user-service, выполнить команду npm i, затем команду npm run dev. Также нужен .env файл в папке user-service с содержимым:
   DB_HOST = localhost
   DB_PORT = 5432
   DB_USER = postgres
   DB_PASSWORD = root
   DB_NAME = postgres
   SECRET_KEY = secret_key

4. Открыть в терминале /client, выполнить команду npm i, затем команду npm start. Также нужен .env файл в папке clinet с содержимым:
   REACT_APP_API_URL: http://localhost:8002

## Второй способ:

Выполнить команду docker compose up и перейти по адресу http://localhost:8001/
