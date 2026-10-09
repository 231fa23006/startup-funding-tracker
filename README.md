# Startup Funding Tracker

A beginner-friendly MERN starter project for listing startups and tracking their funding goals.

## Features
- Browse startup listings
- Search startups by name or industry
- Add, edit, and delete startup listings
- Track funding goal and amount raised
- REST API built with Express
- MongoDB persistence

## Requirements
- Node.js 18+
- MongoDB local installation or a MongoDB Atlas connection string

## Run the backend
```bash
cd server
cp .env.example .env
npm install
npm run dev
```
Edit `server/.env` and set `MONGODB_URI`.

## Run the frontend
Open a second terminal:
```bash
cd client
npm install
npm run dev
```
Open the local URL shown by Vite.

## API endpoints
- `GET /api/startups` — list startups; optional `?search=health`
- `GET /api/startups/:id` — get one startup
- `POST /api/startups` — create a startup
- `PUT /api/startups/:id` — update a startup
- `DELETE /api/startups/:id` — delete a startup

This starter does not yet include authentication or real investor transactions. Add and test those features separately before describing them on your resume.
