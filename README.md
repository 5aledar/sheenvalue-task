# React Admin Dashboard – Candidate Test Submission

This is my submission for the **Front-End Candidate Test** for **SheenValue L.L.C.**  
It is a small **Admin Dashboard** built with **React, TypeScript, Tailwind CSS, React Query, and Zustand**.

The app demonstrates authentication, product CRUD operations, and a product details page using **public APIs**.

---

## 📖 Features

### 🔐 Authentication

- Login page connected to [`reqres.in`](https://reqres.in/api/login)
- Stores token in `localStorage` after successful login
- Logout clears token and redirects to login
- Global auth state managed via **Zustand**

### 📦 Product Management

- Product list fetched from [`dummyjson.com`](https://dummyjson.com/products)
- Displayed in a **paginated table** with **search by title**
- CRUD support:
  - **Add Product** → modal with form validation (React Hook Form + Zod)
  - **Edit Product** → modal pre-filled with product data
  - **Delete Product** → confirmation modal before removal
  - **View Product** → details page with images, description, and mock reviews

### 🎨 UI/UX

- Responsive and mobile-friendly
- Loading states, error handling, and success/error toasts
- Clean layout using **Tailwind CSS + Shadcn/ui components**

---

## ⚡ Tech Stack

- **React 18 + TypeScript** – base framework
- **Tailwind CSS** – utility-first styling
- **Shadcn/ui** – prebuilt UI components
- **React Query (TanStack Query)** – data fetching + caching
- **React Hook Form + Zod** – forms and validation
- **Zustand** – lightweight global state for authentication
- **Vite** – fast dev build tool

---

## 🚀 Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/5aledar/sheenvalue-task.git
   cd sheenvalue-task
   ```

````

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the app locally:

   ```bash
   npm run dev
   ```

4. Open the app at:

   ```
   http://localhost:5173
   ```

---

## ✨ Notes

- APIs used:

  - **Auth**: `POST https://reqres.in/api/login`
  - **Products**: `https://dummyjson.com/products`

- Authentication is **mocked** (no real backend)
- Products API supports **pagination** via `skip` + `limit`

---

## 📩 Candidate Info

Developed and submitted by:
**Khaled abd alslam**
📧 \[[khaledabdalslam99@gmail.com](mailto:your.email@example.com)]
````
