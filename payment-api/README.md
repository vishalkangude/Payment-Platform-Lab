# Payment Platform - Single Port

UI and API are kept in one project folder.

In development, Node.js serves the React UI and API from the SAME port.

## Structure

Payment-Platform/
├── client/       React source
├── server/       Node.js + Express API + static UI serving
├── Dockerfile
├── .dockerignore
├── package.json
└── README.md

## Run locally

First time:

```powershell
npm install
npm run install:all
npm run build
npm run dev
```

Then open:

http://localhost:3000

API health:

http://localhost:3000/health

API endpoints:

http://localhost:3000/api/dashboard
http://localhost:3000/api/payments
http://localhost:3000/api/customers

## After changing React code

Run:

```powershell
npm run build
```

Then restart:

```powershell
npm run dev
```

## Docker

Build:

```powershell
docker build -t payment-platform:1.0 .
```

Run:

```powershell
docker run -p 8080:3000 payment-platform:1.0
```

Open:

http://localhost:8080

## Architecture

Browser
   |
   | http://localhost:3000
   v
Node.js + Express
   |-- React static files
   |
   `-- /api/* -> Payment API

For Docker/AKS, this gives one application image and one application port.
