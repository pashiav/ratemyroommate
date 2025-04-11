# Rate My Roommate

Rate My Roommate is a web app for college students to find and review roommates by name and location - with verified .edu emails for safety. 

Built with:

- Next.js (App Router)
- Clerk (Authentication)
- Supabase (PostgreSQL + API)
- Tailwind CSS (Styling)
- TypeScript (Type Safety)

## Features

- Auth with .edu email only (Clerk)
- Leave reviews for roommates (multiple-choice + short answer)
- Search roommates by name, school, or dorm
- Add your apartment or dorm if it's not listed
- View roommate stats (ratings, review counts)
- Only verified students can write reviews

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/ratemyroommate.git
cd ratemyroommate
```
### 2. Install dependencies
```bash
npm install
# or
pnpm install
```
### 3. Set up environment variables
Create a .env file based on .env.example:

```bash
cp .env.example .env
```
Fill in your Clerk + Supabase credentials:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_key
```
### Local Development
```bash
npm run dev
# or
pnpm dev
```
Visit http://localhost:3000

### Supabase Schema Overview
users: authenticated app users (via Clerk)

roommates: individuals being reviewed

reviews: roommate review data

places: dorms/apartments associated with users

Row-level security (RLS) policies are enabled for all protected tables.

### Tech Stack
|Tech	| Description|
|-----|------|
|Next.js | React framework (App Router)|
|Clerk |	Authentication with .edu restriction|
|Supabase |	PostgreSQL DB + REST API + RLS|
|TailwindCSS |	Utility-first CSS styling|
|TypeScript |	Static typing|

### Deployment
We recommend deploying to Vercel:

Connect your GitHub repo

Add environment variables in the Vercel dashboard

Deploy and you're live 

### Contributing
Feel free to fork and submit pull requests!
We welcome feature ideas, design feedback, or bug fixes.

