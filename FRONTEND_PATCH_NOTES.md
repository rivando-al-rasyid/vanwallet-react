# VanWallet Frontend Patch Notes

Updated to match the newer VanWallet backend split-transaction build.

## Auth

- Changed current-user API from `GET /profile/info` to `GET /auth/me`.
- Updated login flow for the backend's HttpOnly `access_token` cookie.
- Removed stale localStorage token handling and no longer sends session tokens through `Authorization`.
- Added `credentials: "include"` to API requests so browser cookies work.
- Updated dashboard loader to verify the active session through `/auth/me` before opening protected dashboard routes.

## Top Up

- Removed frontend use of `PATCH /transaction/topup/:id/confirm`.
- Removed the confirm-top-up Redux thunk and API helper.
- Updated top-up page to create a pending request only through `POST /transaction/topup`.
- Changed top-up success UI into a pending-payment UI that tells users the balance updates after webhook confirmation.
- Removed the old frontend tax calculation from top-up request amount because the backend top-up DTO only accepts `amount` and `payment_method`.

## Transaction Routes

Public transaction URLs remain compatible with the newer backend:

- `GET /transaction/summary`
- `GET /transaction/report`
- `GET /transaction/history`
- `GET /transaction/receiver`
- `POST /transaction/topup`
- `POST /transaction/transfer`
- `POST /transaction/withdrawal`
- `POST /transaction/expense`

## Validation

- `npm run build` passed successfully.
- `npm run lint` still fails because the project already has many unrelated ESLint errors in existing files, mostly unused imports/components and React hook lint rules. The build itself succeeds.

## Auth artifact cleanup

- Removed Redux Persist from the app shell.
- Removed localStorage session/token helpers.
- Removed persisted `auth` state usage from the dashboard loader.
- The frontend now treats `/auth/me` as the only source of truth for protected routes.
