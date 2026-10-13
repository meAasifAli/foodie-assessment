# Food Delivery API

Backend API for a food delivery ordering application, built with Node.js, Express, and PostgreSQL.

## Features

- List available menu items
- Create guest orders
- Retrieve orders and their items
- Update customer details while an order is still `RECEIVED`
- Update order status with transition validation
- Delete eligible orders
- Centralized error handling
- Automated API tests using Vitest and Supertest

## Tech stack

- Node.js (ES modules)
- Express
- PostgreSQL
- `pg`
- Vitest
- Supertest

## Requirements

- Node.js and npm
- PostgreSQL
- A local database named `food_delivery_db` (or another database configured in `.env`)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a PostgreSQL database:

   ```sql
   CREATE DATABASE food_delivery_db;
   ```

3. Create the tables using the SQL schema included in your project.

4. Copy `.env.example` to `.env` and set your local PostgreSQL credentials.

5. Seed the menu (52 dishes; safe to re-run — existing names are skipped):

   ```bash
   npm run seed:menu
   ```

6. Start the API:

   ```bash
   npm run dev
   ```

   If your project does not have a `dev` script, use the start script defined in `package.json` (for example, `npm start`).

The API commonly runs at `http://localhost:5000`. Use the port configured by your project.

## Environment variables

| Variable | Description |
|---|---|
| `PORT` | Port for the Express server |
| `CLIENT_URL` | Frontend origin allowed by CORS |
| `DB_HOST` | PostgreSQL host |
| `DB_PORT` | PostgreSQL port |
| `DB_NAME` | PostgreSQL database name |
| `DB_USER` | PostgreSQL username |
| `DB_PASSWORD` | PostgreSQL password |

Never commit your real `.env` file or database credentials.

## API endpoints

Base URL: `http://localhost:5000`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Check whether the API is running |
| `GET` | `/api/menu` | List available menu items, paginated (`?page=1&limit=10&search=`) |
| `POST` | `/api/orders` | Create a guest order |
| `GET` | `/api/orders` | List orders |
| `GET` | `/api/orders/:id` | Get an order and its items |
| `PATCH` | `/api/orders/:id` | Update customer details when permitted |
| `PATCH` | `/api/orders/:id/status` | Update order status |
| `DELETE` | `/api/orders/:id` | Delete an eligible order |

### List the menu (paginated)

`GET /api/menu?page=1&limit=10&search=chicken`

| Query | Default | Rules |
|---|---|---|
| `page` | `1` | Positive integer. A page past the end returns an empty `data` array. |
| `limit` | `10` | 1–10. Larger values are rejected with `400`. |
| `search` | — | Optional, ≤ 100 chars. Case-insensitive match on name or description. |

```json
{
  "success": true,
  "count": 10,
  "data": [{ "id": 1, "name": "Classic Burger", "price": "149.00", "...": "..." }],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 56,
    "totalPages": 6,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Create an order

`POST /api/orders`

Example request body:

```json
{
  "customerName": "Aasif Ali",
  "deliveryAddress": "Bengaluru, Karnataka",
  "phone": "9876543210",
  "items": [
    {
      "menuItemId": 1,
      "quantity": 2
    },
    {
      "menuItemId": 2,
      "quantity": 1
    }
  ]
}
```

Prices and the total should be calculated by the backend using database menu prices, not values supplied by the client.

### Update an order status

`PATCH /api/orders/:id/status`

```json
{
  "status": "PREPARING"
}
```

Supported statuses:

- `RECEIVED`
- `PREPARING`
- `OUT_FOR_DELIVERY`
- `DELIVERED`
- `CANCELLED`

Transitions are restricted by the order service. For example, an order cannot jump directly from `PREPARING` to `DELIVERED`.

## Run tests

Run the full automated test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

The current suite includes menu tests, order-creation tests, and order CRUD API tests. API tests use mocked service/repository functions where configured; passing these tests does not replace testing against a real PostgreSQL database.

## Project structure

```text
server/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── middlewares/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── tests/
│   ├── app.js
│   └── server.js
├── .env
├── .env.example
├── .gitignore
└── package.json
```

Some filenames may differ depending on your current implementation.

## Error responses

Errors use a JSON response similar to:

```json
{
  "success": false,
  "message": "A helpful error message"
}
```

For unexpected server errors, the API should return a generic message rather than expose database credentials or internal stack traces.

## Notes

- This is a guest-checkout application; it does not require a user/authentication table.
- Keep credentials in `.env`, and commit only `.env.example`.
- Confirm the database schema and production environment variables before deployment.
