# 🛒 Marketplace Order & Invoice System

This project implements a simplified e-commerce system using a microservices architecture. It manages the order lifecycle and associated invoice handling, simulating a marketplace like MediaMarktSaturn.

## 🧱 Technologies

- **Node.js** (>= 16)
- **TypeScript** (>= 4.5)
- **MongoDB** (NoSQL DB)
- **RabbitMQ** (asynchronous communication between services)
- **Express.js** (REST API)
- **Docker + Docker Compose** (for local development)
- **Jest** (only in `order-service` for now)

---

## 📦 Microservices

### 1. Order Service

Handles the lifecycle of orders.

#### Order statuses
- `CREATED`
- `ACCEPTED`
- `REJECTED`
- `SHIPPING_IN_PROGRESS`
- `SHIPPED`

#### REST Endpoints
- `POST /orders`: Create an order
- `GET /orders`: List all orders
- `GET /orders/:id`: Get order details
- `PATCH /orders/:id`: Update order status

#### Asynchronous Logic
When an order is marked as `SHIPPED`, an event is published to RabbitMQ, which is then processed by the `invoice-service`.

---

### 2. Invoice Service

Handles invoice PDF uploads and tracking when invoices are sent.

#### REST Endpoints
- `POST /invoices`: Upload an invoice (PDF format)
- `GET /invoices/:id`: View invoice

#### Asynchronous Logic
- Upon receiving the `order.shipped` event, if an invoice exists for that order, it is marked as sent (`sentAt = timestamp`).

---

## ⚙️ Local Development

### Requirements

- Docker
- Docker Compose

### Start Services

```bash
docker-compose up --build
```

Services will be available at:
- Order Service: `http://localhost:3001`
- Invoice Service: `http://localhost:3000`
- RabbitMQ UI: `http://localhost:15672` (user: user, pass: password)

---

## 📬 Asynchronous Communication

Uses RabbitMQ for inter-service messaging. When an order status changes to `SHIPPED`, the `order-service` publishes a message to the `msg_order` queue. The `invoice-service` consumes that message and processes it.

---

## ✅ Tests

- `order-service`: includes unit tests and e2e tests with Jest.
- `invoice-service`: **tests pending**.

---

## 🔒 Access Control

**(Not implemented yet)**. As a future improvement, role-based access control (`seller`, `customer`) can be added using JWT.

---

## 📄 Bonus & Future Improvements

- [ ] Authentication & roles **pending**
- [ ] E2E tests
- [ ] CI/CD pipeline (GitHub Actions) **Not tested**
- [ ] Basic admin UI **pending**
- [ ] Robust validation and error handling: **Order Status validation middleware**

---

---

## 🧑‍💻 Author

Developed for the technical challenge by **Ivan Stefanov Asenov**.

---