# Backend Assignment

Node.js REST API for registering users and managing a personal contact book, with JWT authentication.

## What it holds
- `src/app.js` - endpoints: `/register`, `/login`, `/contacts/add|modify|delete`, `/mark-spam`, `/search/name`, `/search/phone`, `/secure-data`
- `src/authMiddleware.js` - JWT authentication
- `src/models/` - Sequelize `User` and `Contact` models
- `scripts/` - database initialisation, sync and sample-data scripts
- `.github/workflows/` - GitHub Actions deployment to Azure

## Stack
Node.js, Express, Sequelize, PostgreSQL, JWT, bcrypt, GitHub Actions

## Run it
```bash
npm install
# set your own database settings
npm run init-db
npm start
```
