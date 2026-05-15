# 🎮 GameStore — Serverless Game Selling Platform

Full-stack serverless game store built with Node.js + Express on AWS Lambda, MongoDB Atlas, React + Tailwind CSS, and Razorpay payments.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js + Express + serverless-http |
| Database | MongoDB Atlas (Mongoose) |
| Deployment | AWS Lambda + API Gateway (Serverless Framework) |
| Frontend | React 18 + Vite + Tailwind CSS |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Payments | Razorpay |
| File Storage | AWS S3 |
| CI/CD | GitHub Actions |

## Project Structure

```
ex10/
├── backend/
│   ├── app.js               # Express app + Lambda handler
│   ├── serverless.yml       # AWS Lambda config
│   ├── seed.js              # DB seed script (10 games)
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API route handlers
│   └── middleware/          # JWT auth middleware
└── frontend/
    └── src/
        ├── pages/           # React page components
        ├── components/      # Reusable UI components
        └── context/         # Global state (Auth + Cart)
```

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `RAZORPAY_KEY_ID` | Razorpay API key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay API secret |
| `AWS_S3_BUCKET` | S3 bucket name for cover images |
| `FRONTEND_URL` | Frontend URL for CORS (e.g. http://localhost:5173) |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |

## Local Development Setup

### Prerequisites
- Node.js 20+
- MongoDB Atlas account
- Razorpay test account
- AWS CLI configured

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in your values
npm run dev            # starts serverless-offline on port 3000
```

### Seed Database

```bash
cd backend
npm run seed           # inserts 10 sample games
```

### Frontend

```bash
cd frontend
npm install
npm run dev            # starts Vite dev server on port 5173
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/games` | — | List games (supports `?genre=&platform=&minPrice=&maxPrice=&search=&page=`) |
| GET | `/games/:id` | — | Single game detail |
| POST | `/games` | Admin JWT | Add new game |
| PUT | `/games/:id` | Admin JWT | Update game |
| POST | `/auth/register` | — | Register user |
| POST | `/auth/login` | — | Login, returns JWT |
| POST | `/orders` | JWT | Create order + Razorpay order |
| POST | `/orders/verify` | JWT | Verify Razorpay payment |
| GET | `/orders/:userId` | JWT | User's order history |

## AWS Deployment

### SSM Parameter Store Setup

Store secrets in AWS SSM before deploying:

```bash
aws ssm put-parameter --name "/game-store/MONGO_URI" --value "your_uri" --type SecureString
aws ssm put-parameter --name "/game-store/JWT_SECRET" --value "your_secret" --type SecureString
aws ssm put-parameter --name "/game-store/RAZORPAY_KEY_ID" --value "rzp_xxx" --type SecureString
aws ssm put-parameter --name "/game-store/RAZORPAY_KEY_SECRET" --value "your_secret" --type SecureString
aws ssm put-parameter --name "/game-store/AWS_S3_BUCKET" --value "your-bucket" --type String
aws ssm put-parameter --name "/game-store/FRONTEND_URL" --value "https://yourdomain.com" --type String
```

### Manual Deploy

```bash
cd backend
npm run deploy
```

## GitHub Actions CI/CD

Add these secrets to your GitHub repository (`Settings → Secrets`):

| Secret | Description |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | AWS IAM access key |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret key |

Push to `main` branch to trigger auto-deploy.

## Creating an Admin User

After registering, update the user role directly in MongoDB:

```js
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

## Razorpay Test Cards

| Card | Number |
|------|--------|
| Success | 4111 1111 1111 1111 |
| Failure | 4000 0000 0000 0002 |

Use any future expiry date and CVV `123`.
