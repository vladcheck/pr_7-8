# E-commerce API

## Запуск

```bash
npm install
npm run dev
```

После этого в консоли будут указаны URL, по которым можно обратиться к API, а также посмотреть Swagger (/api-docs).

## Маршруты

| Маршрут              | Методы                 | Нужна авторизация? |
| :------------------- | ---------------------- | ------------------ |
| `/`                  | `GET`                  | Нет                |
| `/api-docs`          | `GET`                  | Нет                |
| `/api/products`      | `GET`, `POST`          | Нет                |
| `/api/products/:id`  | `GET`, `PUT`, `DELETE` | Да                 |
| `/api/users`         | `GET`                  | Нет                |
| `/api/users/:id`     | `GET`                  | Нет                |
| `/api/auth/register` | `POST`                 | Нет                |
| `/api/auth/login`    | `POST`                 | Да                 |
| `/api/auth/refresh`    | `POST`                 | Да                 |
| `/api/auth/me`       | `GET`                  | Да                 |
