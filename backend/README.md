# QuickKart Backend API

Java 21 + Spring Boot 3.5 + Spring Security/JWT + Spring Data JPA + Microsoft SQL Server.

## 1. Create the database

Open SQL Server Management Studio and execute `database/quickkart-schema.sql`. This creates `QuickKartDB` and its tables.

## 2. Configure the connection

Set environment variables from `.env.example`, especially `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `APP_ADMIN_EMAIL`, and `APP_ADMIN_PASSWORD`. The default values in `application.properties` are for local development only. Do not use the defaults in production.

## 3. Start the API

Install JDK 21 and Maven 3.9+, then run:

```bash
cd backend
mvn spring-boot:run
```

API base URL: `http://localhost:8080/api`

## API overview

| Feature | Endpoint | Access |
|---|---|---|
| Register | `POST /auth/register` | Public |
| Login | `POST /auth/login` | Public |
| Browse/search products | `GET /products?search=&categoryId=` | Public |
| Product details | `GET /products/{id}` | Public |
| Categories | `GET /categories` | Public |
| Cart | `GET /cart`, `POST /cart/items`, `PUT /cart/items/{productId}?quantity=`, `DELETE /cart/items/{productId}` | Customer |
| Wishlist | `GET /wishlist`, `POST /wishlist/{productId}`, `DELETE /wishlist/{productId}` | Customer |
| Addresses | `GET/POST /addresses`, `PUT/DELETE /addresses/{id}` | Customer |
| Place/list orders | `POST /orders`, `GET /orders`, `GET /orders/{id}` | Customer |
| Profile | `GET/PUT /profile` | Customer |
| Admin dashboard | `GET /admin/dashboard` | Admin |
| Admin products | `GET/POST /admin/products`, `PUT/DELETE /admin/products/{id}` | Admin |
| Admin orders | `GET /admin/orders`, `PATCH /admin/orders/{id}/status?status=SHIPPED` | Admin |
| Admin users | `GET /admin/users`, `PATCH /admin/users/{id}/active?value=false` | Admin |

For protected endpoints send `Authorization: Bearer <token>` from the login/register response. Product images currently use image URLs; image upload/storage is a separate integration step. Online payments are not activated; COD and an ONLINE placeholder are represented in the order model. Connect a payment provider before accepting real online payments.
