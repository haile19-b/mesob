# Food Delivery Backend API Documentation

This document provides a comprehensive list of all API endpoints available in the backend. 
Base URL: `http://localhost:5000/api` (or your deployed domain)

> **Note on Authentication:** Endpoints marked with 🔒 require a valid JWT token sent in the `Authorization` header as `Bearer <token>`.

---

## 🔐 Auth (`/api/auth`)

| Method | Endpoint | Description | Request Body / Params |
|--------|----------|-------------|-----------------------|
| `POST` | `/register` | Register a new user | `{ name, phone, password }` |
| `POST` | `/login` | Login and receive a JWT token | `{ phone, password }` |

---

## 🛡️ Admin (`/api/admin`)
*All Admin endpoints require the `ADMIN` role.*

| Method | Endpoint | Description | Request Body / Params |
|--------|----------|-------------|-----------------------|
| `PUT` | `/vendors/:id/approve` | 🔒 Approve a vendor application | `id` (Vendor ID in path) |
| `PUT` | `/agents/:id/approve` | 🔒 Approve an agent application | `id` (Agent application ID in path) |
| `GET` | `/agents` | 🔒 Get a list of all agents | Query: `?isApproved=true` (optional) |

---

## 🛵 Agents (`/api/agents`)

| Method | Endpoint | Description | Request Body / Params |
|--------|----------|-------------|-----------------------|
| `POST` | `/apply` | 🔒 Apply to become an agent | `{ accountNumber, workingHours: [{ start: "08:00am", end: "5:00pm" }] }` |
| `GET`  | `/me`    | 🔒 Get current agent profile/status | *Requires `AGENT` role* |
| `PATCH`| `/me/status` | 🔒 Update working status | `{ status: "AVAILABLE" | "BUSY" | "OFFLINE" }` |
| `GET`  | `/available-vendors`| 🔒 List approved vendors agent can deliver for | *None* |
| `POST` | `/vendors` | 🔒 Opt-in to deliver for vendors | `{ vendorIds: ["uuid-1", "uuid-2"] }` |
| `DELETE`| `/vendors`| 🔒 Opt-out of delivering for vendors | `{ vendorIds: ["uuid-1", "uuid-2"] }` |

---

## 🍔 Meals (`/api/meals`)

| Method | Endpoint | Description | Request Body / Params |
|--------|----------|-------------|-----------------------|
| `GET`  | `/vendor/:vendorId` | Get all meals for a specific vendor | `vendorId` (in path) |
| `POST` | `/` | 🔒 Create a new meal | `{ name, price, imageUrl?, isDeliveryAvailable?, isFreeDelivery?, vendorId? }` |
| `PUT`  | `/:id` | 🔒 Update an existing meal | `{ name?, price?, ... }` |
| `DELETE`| `/:id` | 🔒 Delete a meal | `id` (in path) |

*(Create/Update/Delete require `VENDOR` or `ADMIN` role. Admins must pass `vendorId`, vendors have it auto-assigned).*

---

## 📦 Orders (`/api/orders`)

| Method | Endpoint | Description | Request Body / Params |
|--------|----------|-------------|-----------------------|
| `POST` | `/` | 🔒 Create a new order | `{ vendorId, orderType: "DELIVERY" | "DINE_IN", items: [{ mealId, quantity }] }` |
| `GET`  | `/my-orders` | 🔒 Get orders placed by current user | *Requires `USER` role* |
| `GET`  | `/vendor` | 🔒 Get orders for the current vendor | *Requires `VENDOR` role* |
| `GET`  | `/agent` | 🔒 Get orders assigned to current agent | *Requires `AGENT` role* |
| `POST` | `/:id/accept` | 🔒 Accept a delivery order | *Requires `AGENT` role* |
| `PATCH`| `/:id/status` | 🔒 Update the status of an order | `{ status: "PENDING", "ACCEPTED_BY_AGENT", "PREPARING", "OUT_FOR_DELIVERY", "COMPLETED", "CANCELLED" }` |
| `GET`  | `/vendors/:vendorId/agents` | 🔒 List online/available agents for a vendor | `vendorId` (in path) |

---

## 🏪 Vendors (`/api/vendors`)

| Method | Endpoint | Description | Request Body / Params |
|--------|----------|-------------|-----------------------|
| `GET`  | `/` | List all approved vendors | *None* |
| `GET`  | `/:id` | Get vendor details by ID | `id` (in path) |
| `POST` | `/` | 🔒 Create a new vendor application | `{ name, location, phone }` |
| `PUT`  | `/:id` | 🔒 Update vendor info | `{ name?, location?, phone?, managerId? }` (Requires `VENDOR` or `ADMIN`) |
| `DELETE`| `/:id` | 🔒 Delete a vendor | `id` (Requires `ADMIN` role) |
