# Отчёт по лабораторной работе: "Создание веб-приложения для ведения блога"

## Введение
В данной лабораторной работе была реализована система непрерывной интеграции (CI) и применены техники масштабирования для распределённого веб-приложения блога, состоящего из нескольких микросервисов.

## Настройка CI-процесса

### Проверка линтером
Настроен многоуровневый линтинг для всех компонентов системы:
- Gateway (API Gateway)
- User Service (сервис пользователей)
- Post Service (сервис постов)
- Client (фронтенд)

### Фрагмент ci.yml
![image](https://github.com/user-attachments/assets/e10a9d80-b878-4159-b513-edb2f2846c34)

### Статический анализ
Реализована комплексная проверка типов TypeScript с индивидуальными настройками для каждого сервиса:
- Gateway
- User Service
- Post Service
- Client

### Фрагмент ci.yml
![image](https://github.com/user-attachments/assets/5d72d03f-faec-48e7-a987-730db4de2a22)

### Автоматическое тестирование
Реализована многоуровневая система тестирования с изолированной тестовой базой данных

### Фрагмент ci.yml
![image](https://github.com/user-attachments/assets/9f34084b-b0ad-4a1a-bb8a-39d352fcab6b)
![image](https://github.com/user-attachments/assets/b25a7ecd-d179-4c1b-ae29-d5551a6f1785)

## Масштабирование системы
### Архитектура масштабирования
Система использует комбинированный подход к масштабированию:
- Балансировка нагрузки L7 (Nginx) для сервисов
- Репликация PostgreSQL (master-slave)
- Репликация сервисов через Docker Compose

### Конфигурация для user-service
![image](https://github.com/user-attachments/assets/47fd3da6-dd35-428b-a9e2-bf9d8046a390)

### Конфигурация для post-service
![image](https://github.com/user-attachments/assets/a7fe57a7-b9c0-4f5b-b8e5-0faba690c87a)

### Репликация сервисов
![image](https://github.com/user-attachments/assets/6bd83d0e-20d1-44d7-9ce3-067416d6c04a)
![image](https://github.com/user-attachments/assets/05c574cf-e166-44f3-9b92-3898eed41e7b)

### Репликация базы данных
Master:

![image](https://github.com/user-attachments/assets/d2d40bec-38c9-439b-8e25-7ebcec227bde)

Slave-1:

![image](https://github.com/user-attachments/assets/e74d962e-13f4-44b2-8d87-470a7248d7d5)

Slave-2:

![image](https://github.com/user-attachments/assets/99328546-17a0-4ec1-a4ff-8907d009edca)

## Централизованное логгирование
Настроен стек для логирования:
- Graylog (центральный сервер логирования)

![image](https://github.com/user-attachments/assets/e25151a7-1072-4475-ac15-74a8597f8369)

- MongoDB (для хранения метаданных Graylog)

![image](https://github.com/user-attachments/assets/f7d54cdd-8a50-4f8b-93fd-b3956a035128)


- Elasticsearch (для хранения логов)

![image](https://github.com/user-attachments/assets/3db6ece3-3b1a-470e-8d76-9e68369d126c)

## Тестирование
Дописаны новые и обновлены старые тесты для post-service и user-service

### Реализованные тесты

1. **User Service**:
   - Регистрация пользователя (успешная и с ошибками)
   - Авторизация (валидные и невалидные данные)
   - Проверка аутентификации (с токеном и без)

2. **Post Service**:
   - Создание постов (с авторизацией и без)
   - Получение списка постов (с фильтрацией и сортировкой)
   - Просмотр отдельного поста
   - Обновление и удаление постов

## Выводы

В ходе работы были реализованы:
- Полноценная CI-цепочка с линтингом, статическим анализом и тестированием.
- Масштабируемая архитектура с балансировкой нагрузки и репликацией сервисов.
- Отказоустойчивая конфигурация базы данных с мастер-слейв репликацией.
- Централизованная система логирования на базе Graylog.
- Необходимые тесты
*Система демонстрирует высокую доступность и отказоустойчивость благодаря применённым техникам масштабирования.*
