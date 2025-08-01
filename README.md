# Dropr - Get Your Goods!

A mobile-first delivery application designed for rural Pakistani areas, featuring AI-powered chat ordering for food, medicines, and groceries. Built with React, Node.js, and DeepSeek AI integration.

## Features

- **AI-Powered Ordering**: Natural language chat interface supporting English and Urdu
- **Three Main Categories**: Food, Medicine, and Groceries
- **Mobile-First Design**: Optimized for smartphones with purple and yellow color scheme
- **Real-Time Order Tracking**: Status updates and delivery estimates
- **Search Functionality**: Find products quickly across all categories
- **User Management**: Profile and delivery address management
- **Offline Support**: Network status indicators and resilient design

## Tech Stack

- **Frontend**: React 18, TypeScript, TailwindCSS, Shadcn/ui
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM (in-memory storage for development)
- **AI**: DeepSeek R1 via OpenRouter API
- **State Management**: TanStack Query
- **Routing**: Wouter
- **Development**: Vite with hot reload

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 20 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

## Local Setup Instructions

### 1. Clone the Repository

```bash

git clone https://github.com/Asferrasool/dropr.git
cd deliverpak


### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
touch .env
```

Add the following environment variables:

```env
# Required: OpenRouter API Key for AI functionality
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Optional: Database configuration (if using PostgreSQL)
DATABASE_URL=postgresql://username:password@localhost:5432/deliverpak
PGPORT=5432
PGUSER=your_db_user
PGPASSWORD=your_db_password
PGDATABASE=deliverpak
PGHOST=localhost

# Development
NODE_ENV=development
```

### 4. Get OpenRouter API Key

1. Visit [OpenRouter.ai](https://openrouter.ai)
2. Create an account or sign in
3. Navigate to the API Keys section
4. Generate a new API key
5. Copy and paste it into your `.env` file

### 5. Start the Development Server

```bash
npm run dev
```

This command will:
- Start the Express backend server on port 5000
- Start the Vite frontend development server
- Enable hot reload for both frontend and backend
- Open the application in your default browser

### 6. Access the Application

- **Frontend**: The app will automatically open in your browser
- **Backend API**: Available at `http://localhost:5000/api`
- **Mobile View**: Use browser dev tools to simulate mobile devices

## Project Structure

```
dropr/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components (Home, Orders, Search, Profile)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and configurations
│   │   └── index.css       # Global styles and Tailwind config
│   └── index.html          # HTML template
├── server/                 # Backend Express application
│   ├── services/           # External service integrations (OpenAI)
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Data storage layer
│   └── vite.ts            # Vite middleware integration
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema and TypeScript types
├── package.json           # Dependencies and scripts
├── tailwind.config.ts     # Tailwind CSS configuration
├── vite.config.ts         # Vite build configuration
└── README.md              # This file
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations

## API Endpoints

### Categories
- `GET /api/categories` - Get all product categories

### Products
- `GET /api/products` - Get all products
- `GET /api/products?category=<id>` - Get products by category
- `GET /api/products?search=<query>` - Search products
- `GET /api/products/:id` - Get single product

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders?userId=<id>` - Get orders by user
- `GET /api/orders/:id` - Get single order with items
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id/status` - Update order status

### AI Chat
- `POST /api/chat` - Send message to AI assistant
- `GET /api/chat/:userId` - Get chat history
- `POST /api/ai/create-order` - Create order from AI chat

## Database Setup (Optional)

The app uses in-memory storage by default for development. To use PostgreSQL:

1. Install PostgreSQL locally
2. Create a database named `dropr`
3. Update the `DATABASE_URL` in your `.env` file
4. Run migrations: `npm run db:migrate`

## Customization

### Color Scheme
The app uses a purple and yellow color scheme defined in `client/src/index.css`:
- Primary: Purple gradient (`hsl(258, 89%, 66%)`)
- Accent: Yellow (`hsl(45, 93%, 58%)`)

### AI Model
Currently configured to use DeepSeek R1 free model. To change:
1. Edit `server/services/openai.ts`
2. Update the `model` parameter in API calls

### Supported Languages
- English (default)
- Urdu (romanized) - for Pakistani rural context

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   Error: listen EADDRINUSE: address already in use 0.0.0.0:5000
   ```
   Solution: Kill the process using port 5000 or change the port in server configuration.

2. **OpenRouter API errors**
   - Verify your API key is correct
   - Check your OpenRouter account has sufficient credits
   - Ensure you're using the correct model name

3. **Dependencies issues**
   ```bash
   npm install --force
   ```

4. **Build errors**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

### Development Tips

- Use browser dev tools mobile simulation for testing
- Check the console for API response logs
- The app is designed mobile-first, so test on small screens
- Chat responses may take a few seconds due to AI processing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on mobile devices
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the console logs for error messages
3. Ensure all environment variables are properly set
4. Verify your OpenRouter API key is active and has credits

---

Built with ❤️ for rural Pakistan communities
