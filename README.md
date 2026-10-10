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
Technologies Used

* React.js
* Node.js
* Express.js
* MongoDB
* Mongoose
* Vite

Code0 and AI-Assisted Development

Code0 was used as an AI-assisted development tool during the development of this project. AI-generated suggestions were reviewed, tested, and modified as needed to ensure the application worked correctly.

Tasks Assisted by Code0

1. Frontend Development: Assisted with React component structure and startup listing UI.
2. REST API Development: Assisted with implementing and reviewing Express API endpoints.
3. Database Integration: Assisted with MongoDB and Mongoose integration.
4. Debugging: Assisted with investigating errors, including the backend port conflict on port 5001.
5. Testing and Refactoring: Assisted with reviewing CRUD operations and improving code readability.

Validation

I manually tested startup creation, listing, editing, and deletion through the application and verified that the backend connected to MongoDB.

Project Ownership

I reviewed the implementation, tested the application, and worked through development issues to understand how the frontend, backend, and database interact.

Assessment Submission

* Public GitHub repository: Add your repository URL here.
* Application: Startup Funding Tracker