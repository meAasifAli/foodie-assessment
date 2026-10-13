# foodie. — client

React 19 + Vite + Tailwind CSS v4 + Redux Toolkit frontend for the food delivery assessment. Guest checkout only.

## Design

Application flow and wireframes:

![Application flow and wireframes](../design%20system%20assessment.png)

## Scripts

```bash
npm run dev      # Vite dev server on :5173, proxies /api → http://localhost:5000
npm run build    # production build into dist/
npm run test     # Vitest + Testing Library (jsdom)
npm run lint
```

The Express API (`../server`) must be running for the app to load data.

## Routes

| Path          | Page                                                         |
| ------------- | ------------------------------------------------------------ |
| `/`           | Hero + menu from `GET /api/menu`, 10 per page, server search |
| `/cart`       | Cart (Redux, persisted to localStorage)                      |
| `/checkout`   | Guest details form → `POST /api/orders`                      |
| `/orders`     | All orders via `GET /api/orders` + track-by-number form      |
| `/orders/:id` | Order tracking via `GET /api/orders/:id`, polled every 15 s  |
| `*`           | 404                                                          |

## Structure

```
src/
  app/store.js              Redux store + localStorage persistence
  features/cart/            cartSlice (actions, selectors), cartStorage (validated rehydrate)
  features/checkout/        validateCheckout
  hooks/                    useMenu, useCart, useCheckout, useOrder
  lib/                      api.js (fetch wrapper, ApiError), money.js (paise), images.js
  services/                 menuApi.js, orderApi.js (normalise API → UI shapes)
  components/ui/            primitives: Button, Input, Textarea, Label, FormField, Alert, ...
  components/layout/        AppLayout, Navbar, Footer, Logo, PageHeader
  components/{menu,cart,checkout,order}/
  pages/{home,cart,checkout,orders,not-found}/
```

## Notes

- **Money**: all client maths is in integer paise. Checkout sends only `menuItemId` + `quantity`; the backend prices the order from PostgreSQL and the tracking page shows the server's total.
- **Status updates** are HTTP polling (15 s, paused while the tab is hidden, stopped at `DELIVERED`/`CANCELLED`). There are no WebSockets. Customers can't change order status.
- **Production hosting**: client-side routes need an SPA fallback so a refresh on `/orders/42` serves `index.html`, e.g. Netlify `_redirects`: `/* /index.html 200`; Vercel: a rewrite of `/(.*)` to `/index.html`; nginx: `try_files $uri /index.html;`. The `/api` proxy is dev-only, so production also needs `/api` routed to the Express server (or a same-origin reverse proxy).
