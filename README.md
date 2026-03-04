# E-commerce API
## Маршруты
| Маршрут | Методы | Нужна авторизация? |
| --- | --- | --- |
| / | GET | Нет |
| /api/products | GET, POST | Нет |
| /api/products/:id | GET,PUT,DELETE | Да |
| /api/users | GET | Нет |
| /api/users/:id | GET | Нет |
| /api/auth/register | POST | Нет |
| /api/auth/login | POST | Да |
| /api/auth/me | GET | Да |