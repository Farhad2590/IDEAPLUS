# IdeaPlus

A modern roadmap management platform where users can submit feature requests, discuss ideas, and vote on what gets built next.

## Features

- **Roadmap Submissions**: Create and categorize feature requests with different statuses
- **Threaded Comments**: Engage in discussions with 2-level comment threads
- **Upvote System**: Vote on ideas you want to see implemented
- **User Profiles**: Upload profile photos and manage your contributions
- **Real-time Updates**: See votes and comments update instantly


## Live URLs

- **Frontend**: [https://ideapluse.netlify.app](https://ideapluse.netlify.app)
- **Backend**: [hhttps://ideaplus.vercel.app](hhttps://ideaplus.vercel.app)


## Tech Stack

**Frontend**
- React.js
- Tailwind CSS
- JavaScript

**Backend**
- Node.js
- Express.js
- JWT Authentication
- Joi Validation
- MVC Architecture

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/ideaplus.git
cd ideaplus
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables
```bash
# In backend folder, create .env file
cp .env.example .env
# Add your database URL, JWT secret, etc.
```

5. Start the development servers

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm start
```

The app will be running at `http://localhost:5173`

## Project Structure

```
ideaplus/
├── frontend/           # React application
│   ├── src/
│   │   ├── Components/
│   │   ├── Pages/
│   │   └── Utils/
├── backend/            # Express API
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── middleware/
└── README.md
```

## API Endpoints

- `GET /api/roadmaps` - Get all roadmap items
- `POST /api/roadmaps` - Create new roadmap item
- `POST /api/comments` - Add comment to roadmap
- `POST /api/upvotes` - Toggle upvote on item
- `POST /api/auth/login` - User authentication



## Contact

My Mail -farhadhossen2590@example.com
