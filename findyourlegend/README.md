# FindYourLegend CRM

A complete CRM application for football/soccer management built with Next.js 14, TypeScript, Tailwind CSS, and Prisma.

## Features

### 🏟️ Clubs Management
- Create, read, update, and delete football clubs
- Store club information: name, city, country, logo, contact details
- Track players and contacts associated with each club

### ⚽ Players Management  
- Manage football players with detailed profiles
- Player information: name, age, position, nationality, photo, contact details
- Link players to their respective clubs
- Track contacts related to each player

### 📞 Contacts Management
- Maintain contacts for clubs and players
- Contact types: Club contacts (agents, managers) and Player contacts
- Store contact information: name, role, email, phone, notes
- Flexible relationship system between contacts and clubs/players

### 🎨 Modern UI/UX
- Clean and responsive design with Tailwind CSS
- Shadcn/ui components for consistent styling
- Data tables with search, pagination, and sorting
- Modal forms for create/edit operations
- Sidebar navigation with active state indicators

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: Shadcn/ui, Radix UI primitives
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (we recommend Neon for free hosting)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd findyourlegend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your database URL and other required variables:
```
DATABASE_URL="postgresql://username:password@ep-xxx.neon.tech/findyourlegend?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

4. Set up the database:
```bash
npm run db:push
npm run db:generate
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Database Schema

### Clubs
- Basic information (name, city, country, logo, website)
- Contact details (email, phone)
- Relationships with players and contacts

### Players  
- Personal information (name, age, nationality, photo)
- Football details (position, club affiliation)
- Contact information and related contacts

### Contacts
- Personal details (name, role, contact information)
- Type-based relationships (Club or Player contacts)
- Optional notes field for additional context

## API Routes

The application provides RESTful API endpoints:

- `GET|POST /api/clubs` - List clubs or create new club
- `GET|PUT|DELETE /api/clubs/[id]` - Get, update, or delete specific club
- `GET|POST /api/players` - List players or create new player  
- `GET|PUT|DELETE /api/players/[id]` - Get, update, or delete specific player
- `GET|POST /api/contacts` - List contacts or create new contact
- `GET|PUT|DELETE /api/contacts/[id]` - Get, update, or delete specific contact

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── api/             # API routes
│   ├── clubs/           # Clubs page
│   ├── players/         # Players page
│   ├── contacts/        # Contacts page
│   └── globals.css      # Global styles
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── layout/         # Layout components
│   ├── clubs/          # Club-specific components
│   ├── players/        # Player-specific components
│   └── contacts/       # Contact-specific components
├── lib/                # Utility functions
├── types/              # TypeScript type definitions
└── generated/          # Generated Prisma client
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio
- `npm run db:generate` - Generate Prisma client
- `npm run db:reset` - Reset database

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on git push

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
