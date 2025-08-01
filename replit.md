# Overview

DeliverPak is a mobile-first delivery service application designed for rural Pakistani areas. The application facilitates ordering of food, medicine, and groceries through an AI-powered chat interface, with a focus on serving remote communities with limited connectivity. The system features a React frontend with Node.js/Express backend, PostgreSQL database with Drizzle ORM, and OpenAI integration for intelligent order processing.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: TailwindCSS with custom color scheme (purple gradient primary, yellow accent)
- **State Management**: TanStack Query for server state and caching
- **Routing**: Wouter for lightweight client-side routing
- **Mobile-First Design**: Optimized for smartphones with bottom navigation and touch interactions

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints for categories, products, orders, and chat
- **Development**: Hot reload with Vite middleware integration
- **Error Handling**: Centralized error middleware with status code mapping

## Data Storage
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema**: Well-defined tables for users, categories, products, orders, order items, and chat messages
- **Migrations**: Drizzle Kit for database schema management
- **Backup Storage**: In-memory storage implementation for development/testing

## AI Integration
- **Provider**: OpenAI GPT-4o for natural language processing
- **Capabilities**: Order intent recognition, item extraction, and conversational responses
- **Multilingual**: Supports both English and Urdu (romanized) for local accessibility
- **Context Awareness**: Understanding of Pakistani food items, medicines, and grocery needs

## Authentication & Sessions
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple
- **User System**: Complete user registration with location details (village, district, province)
- **Security**: Password-based authentication with secure session storage

## External Dependencies
- **Database**: PostgreSQL (configured for Neon serverless)
- **AI Service**: OpenAI API for chat processing and order intelligence
- **Development**: Replit-specific tooling for cloud development environment
- **UI Components**: Radix UI for accessible, unstyled component primitives
- **Form Handling**: React Hook Form with Zod validation schemas