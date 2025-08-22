# Quick Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- npm, yarn, or bun
- Supabase account

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abdinasir-Osman/HEG_payment.git
   cd HEG_payment
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Set up environment variables**
   - Create a `.env` file in the root directory
   - Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run database migrations**
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Link your project
   supabase link --project-ref your_project_ref
   
   # Run migrations
   supabase db push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Navigate to `http://localhost:8080`

## Database Setup

The application uses three main tables:
- `users` - User information
- `payment_plans` - Available payment plans
- `payments` - Payment records

Default payment plans are automatically created:
- Monthly: $50
- 6 Months: $280
- Yearly: $500

## Features

- ✅ User Management
- ✅ Payment Tracking
- ✅ Payment Plans
- ✅ Reports & Analytics
- ✅ CSV Export
- ✅ Responsive Design
