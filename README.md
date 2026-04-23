# React BMS Starter (from `docfile`)

This repository now contains a React app scaffold based on the provided `docfile`.

## Step-by-step setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Then set:
   - `REACT_APP_BACKEND_URL` to your backend base URL.

3. **Run the app**
   ```bash
   npm start
   ```
   App runs at `http://localhost:3000`.

4. **Verify API integration (Axios)**
   - Open the home page.
   - It sends `GET {REACT_APP_BACKEND_URL}/api/` and shows the response message.

5. **Create core modules next (recommended order)**
   - Auth (login/register/forgot password)
   - Dashboard (role-based widgets)
   - Buildings/Wings/Units
   - Users + RBAC
   - Billing + Stripe
   - Parking
   - Visitors (QR/OTP)
   - Canteen
   - Complaints
   - Voting + Notices

## Implemented files

- `frontend/package.json` (React + axios + routing)
- `frontend/public/index.html` (font setup: Outfit + IBM Plex Sans)
- `frontend/src/index.js`
- `frontend/src/index.css`
- `frontend/src/App.js` (routing + API ping)
- `frontend/src/App.css` (responsive layout + design tokens)
- `frontend/.env.example`

