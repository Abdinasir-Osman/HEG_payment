# HEG Payment Management System

A modern, full-stack payment management application built with React, TypeScript, and Supabase. This system helps manage user registrations, payment plans, and payment tracking for educational institutions or organizations.

## 🚀 Features

- **User Management**: Register and manage users with detailed information
- **Payment Plans**: Configure different payment plans (monthly, 6-month, yearly)
- **Payment Tracking**: Track payment status (paid, unpaid, partial) for each user
- **Dashboard Analytics**: Real-time overview of payment statistics
- **Responsive Design**: Modern UI built with shadcn/ui components
- **Real-time Data**: Powered by Supabase for instant data synchronization

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Radix UI + Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Database**: Supabase (PostgreSQL)
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts for data visualization

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v18 or higher)
- npm, yarn, or bun package manager
- A Supabase account and project

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/HEG_payment.git
cd HEG_payment
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
bun install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Important:** Never commit your `.env` file to version control. It's already included in `.gitignore`.

### 4. Run Database Migrations

```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Link your project
supabase link --project-ref your_project_ref

# Run migrations
supabase db push
```

### 5. Start Development Server

```bash
npm run dev
# or
yarn dev
# or
bun dev
```

The application will be available at `http://localhost:8080`

## 📁 Project Structure

```
HEG_payment/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── AppSidebar.tsx  # Main navigation sidebar
│   │   └── Layout.tsx      # Main layout wrapper
│   ├── hooks/              # Custom React hooks
│   │   ├── useUsers.ts     # User management hooks
│   │   └── usePayments.ts  # Payment management hooks
│   ├── integrations/       # External service integrations
│   │   └── supabase/       # Supabase client and types
│   ├── pages/              # Application pages
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   ├── RegisterUser.tsx
│   │   ├── ManageUsers.tsx
│   │   ├── ManagePayments.tsx
│   │   └── Reports.tsx
│   └── lib/                # Utility functions
├── supabase/               # Database migrations and config
└── public/                 # Static assets
```

## 🗄️ Database Schema

The application uses three main tables:

### Users Table
- `id`: Unique identifier
- `full_name`: User's full name
- `phone_number`: Contact number (unique)
- `email`: Email address (optional)
- `gender`: Gender selection
- `address`: Physical address (optional)

### Payment Plans Table
- `id`: Unique identifier
- `name`: Plan name (e.g., "Monthly", "Yearly")
- `amount`: Total amount for the plan
- `duration_months`: Duration in months

### Payments Table
- `id`: Unique identifier
- `user_id`: Reference to users table
- `plan_id`: Reference to payment_plans table
- `amount_paid`: Amount already paid
- `amount_remaining`: Outstanding balance
- `status`: Payment status (paid/unpaid/partial)
- `payment_date`: Date of payment

## 🎯 Key Features Explained

### Dashboard
- Real-time statistics showing total users, paid users, unpaid users, and partial payments
- Visual charts and graphs for payment overview
- Quick access to recent activities

### User Management
- Register new users with comprehensive information
- Search and filter existing users
- Edit user details and contact information
- Delete users (with payment history cleanup)

### Payment Management
- Create payment records for users
- Track payment status and amounts
- Update payment information
- View payment history per user

### Reports
- Generate payment reports
- Export data for analysis
- View payment trends and statistics

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Deploy to Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables

### Environment Variables

Make sure to set these environment variables in your deployment platform:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/HEG_payment/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔄 Updates and Maintenance

- Regularly update dependencies for security patches
- Monitor Supabase usage and limits
- Backup database regularly
- Test thoroughly before deploying updates

---

**Built with React, TypeScript, and Supabase**
