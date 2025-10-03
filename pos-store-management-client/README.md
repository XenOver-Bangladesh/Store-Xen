# Store-Xen POS Store Management — Client

Modern React (Vite) frontend for Store-Xen: a Point of Sale (POS) and store management system. This client provides the dashboard layout, navigation (header, sidebar), and pages to manage store operations.

—

## Live Link

<!-- - Live (Client): <your-live-url-here> -->
-not available 

—

## Tech Stack

- React 19
- Vite 7
- React Router 7
- Tailwind CSS 4
- ESLint 9

—

## Prerequisites

- Node.js >= 18
- npm >= 9

—

## Getting Started (Run Locally)

1. Clone the repository
   ```bash
   git clone <repo-url>
   cd pos-store-management-client
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Configure environment variables (optional but recommended)
   - Create a `.env` file in the project root
   - Add variables (Vite uses the `VITE_` prefix):
     ```bash
     VITE_API_BASE_URL=http://localhost:4000
     VITE_APP_NAME=Store-Xen POS
     ```
4. Start the development server
   ```bash
   npm run dev
   ```
   - The app runs at `http://localhost:5173` by default (Vite).

—

## Available Scripts

- `npm run dev`: Start the Vite dev server with HMR
- `npm run build`: Create a production build
- `npm run preview`: Preview the production build locally
- `npm run lint`: Run ESLint

—

## Project Structure (Client)

```
pos-store-management-client/
├─ public/
├─ src/
│  ├─ Components/
│  │  ├─ Header/
│  │  ├─ Sidebar/
│  │  └─ Footer/
│  ├─ Layouts/
│  │  └─ DashboardLayout.jsx
│  ├─ Pages/
│  │  └─ HomePage/
│  ├─ Routes/
│  ├─ App.jsx
│  └─ main.jsx
└─ vite.config.js
```

—

## Environment Variables

Add these in `.env` as needed (examples):

- `VITE_API_BASE_URL`: Base URL of the backend API
- `VITE_APP_NAME`: App title used in the UI

—

## Deployment

1. Build the app
   ```bash
   npm run build
   ```
2. Serve the `dist/` folder on your hosting provider (e.g., Netlify, Vercel, static hosting, or behind your backend).

—

## Notes

- This is the client/frontend. Ensure the backend API is reachable via `VITE_API_BASE_URL`.
- Adjust Tailwind or CSS as needed in `src/index.css` and component styles.

—

## License

Add your license information here.
