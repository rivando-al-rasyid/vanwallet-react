# VanWallet React

VanWallet React is a React dashboard application for managing wallet balance, top-up, transfer, withdrawal, expense, transaction history, profile, PIN, and password settings.

The app is built with **React**, **Vite**, **Redux Toolkit**, **Tailwind CSS**, **DaisyUI**, **Nginx**, and **Chart.js**.

## Tech Stack

* React
* Vite
* Redux Toolkit
* React Router
* Redux Persist
* React Hook Form
* Joi validation
* Tailwind CSS
* DaisyUI
* Chart.js
* React Chart.js 2
* Font Awesome
* Docker
* Nginx production server

## Project Structure

```txt
frontend/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── layouts/
│   ├── pages/
│   │   ├── auth/
│   │   └── dashboards/
│   ├── schemas/
│   ├── store/
│   │   └── slices/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── style.css
├── Dockerfile
├── nginx.conf
├── package.json
├── vite.config.js
└── README.md
```

## Requirements

* Node.js
* npm
* Backend API running
* Docker, optional

## Install Dependencies

```bash
npm install
```

## Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=/api
```

For Docker deployment, `/api` is recommended because Nginx reverse-proxies requests to the backend.

For direct local backend access, you can use:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Using `/api` is cleaner when the frontend container reverse-proxies requests to the backend.

## Run Development Server

```bash
npm run dev
```

Default Vite URL:

```txt
http://localhost:5173
```

## Build Production

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Lint

```bash
npm run lint
```

## Docker

Build and run through Docker Compose from the backend project if your compose file includes the frontend service.

The frontend is served by Nginx on `$PORT`, with `8080` as the default.

```bash
docker build -t vanwallet-frontend .
docker run --rm -p 8080:8080 \
  -e PORT=8080 \
  -e BACKEND_URL=https://vanwallet-backend.onrender.com \
  vanwallet-frontend
```

```txt
http://localhost:8080
```

## Reverse Proxy

The frontend Nginx container proxies API and backend image requests:

```txt
/api/ -> BACKEND_URL/
/img/ -> BACKEND_URL/img/
```

This allows frontend API calls to use:

```txt
/api
```

instead of calling the backend host directly.

## Main Pages

```txt
/                         Home
/login                    Login
/register                 Register
/dashboard                Dashboard
/dashboard/history        Transaction History
/dashboard/transfer       Transfer User List
/dashboard/transfer/:id   Set Transfer Nominal
/dashboard/topup          Top Up
/dashboard/profile        Profile
```

## Main Features

### Authentication

* Login
* Register
* Register PIN
* Ask PIN
* Forgot password
* Reset password
* Logout

### Dashboard

* Balance summary
* Income summary
* Expense summary
* Financial chart
* Recent transaction history

### Financial Chart

The dashboard chart supports:

```txt
7 Days
14 Days
30 Days
```

Filter options:

```txt
All
Income
Expense
```

Behavior:

* `All` shows income and expense side by side.
* `Income` shows only the blue income bars.
* `Expense` shows only the red expense bars.
* `7 Days` uses weekday labels.
* `14 Days` and `30 Days` use date labels to avoid repeated weekday names.

### Transaction History

The history page uses:

```txt
GET /transaction/history
```

Supported filters:

```txt
page
limit
q
source
type
status
direction
start_date
end_date
```

The table supports pagination under the table:

```txt
Show 10 History of 100 History
Prev 1 2 3 4 5 Next
```

### Transfer

The transfer page uses:

```txt
GET /transaction/receiver
```

Supported query parameters:

```txt
page
limit
q
query
```

The page shows all users by default and supports search later.

Pagination appears under the table:

```txt
Show 10 User of 100 User
Prev 1 2 3 4 5 Next
```

## API Utility

The main API helper is located in:

```txt
src/utils/api.js
```

Redux transaction logic is located in:

```txt
src/store/slices/transactionSlice.js
```

## Important API Endpoints Used

```txt
POST /auth/login
POST /auth/register
POST /auth/logout
GET  /profile/info

GET  /transaction/summary
GET  /transaction/history
GET  /transaction/receiver

POST /transaction/topup
PATCH /transaction/topup/:id/confirm
POST /transaction/transfer
POST /transaction/withdrawal
POST /transaction/expense
```

## Recommended Development Flow

Start backend first:

```bash
docker compose up -d --build
```

Then start frontend locally:

```bash
npm run dev
```

Or run both through Docker Compose if frontend is included in the compose file.

## Build Check

Before committing changes:

```bash
npm run lint
npm run build
```

## Development Notes

* Keep API calls centralized in `src/utils/api.js`.
* Keep async transaction state in `src/store/slices/transactionSlice.js`.
* Use `/api` as the frontend API base when using the Docker frontend server.
* Do not re-add old transaction list/detail endpoints on the frontend.
* Use `GET /transaction/history` as the main transaction data source.
* Use `GET /transaction/receiver` as the transfer receiver data source.


## License

This project is licensed under the MIT License.

See the `LICENSE` file for details.
