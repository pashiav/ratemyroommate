            _Π___🔥_
          /_🔥__/__＼
         |🔥 田｜門 🔥
      `..`.`..`.`...``.
# Rate My Roommate 𐀪☆

A roommate review platform that lets you warn other students about nightmare roommates. You can only see reviews for people at your school. Built with .edu email verification because fake reviews suck.

## Why This Exists

We had terrible roommates and wished we could have known beforehand. This is basically Yelp for roommates - so you can avoid the people who don't clean, blast music at 3am, or invite strangers over constantly.

All reviews require verified .edu emails, so it's actual students sharing real experiences, not random internet trolls. You can only access reviews for roommates at your own school.

## What It Does

- **Search roommates by name** - see if anyone has reviewed them
- **Leave detailed reviews** - rate cleanliness, noise level, communication, etc.
- **Add housing locations** - dorms, apartments, whatever
- **Student verification only** - .edu email required to post anything

### Review System
Rate roommates on:
- Overall experience (1-5 stars)
- Cleanliness, communication, responsibility, noise level
- Sleep schedule compatibility, guest frequency
- Pet situation and impact
- Whether you'd recommend them (spoiler: probably not if you're here)

## Tech Stack

- **Next.js 15** with TypeScript and App Router
- **Clerk** for auth (.edu email restriction)
- **Supabase** for database with Row Level Security
- **Tailwind CSS** for styling
- **Radix UI** components

## Setup

### Prerequisites
- Node.js 18+
- Clerk account
- Supabase account

### Installation

```bash
git clone https://github.com/your-username/ratemyroommate.git
cd ratemyroommate
npm install
```

### Environment Variables
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-key
CLERK_SECRET_KEY=your-clerk-secret
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
```

### Database Setup
1. Create a Supabase project
2. Run the SQL from `supabase-schema.sql`
3. Configure RLS policies

### Run It
```bash
npm run dev
```
Open http://localhost:3000

## Usage

1. Sign up with your .edu email
2. Search for potential roommates by name
3. Read existing reviews (if any)
4. Leave your own review if you've lived with them
5. Help other students dodge bullets

## API Routes

### Authentication
- `/api/auth/sign-up` - Create account
- `/api/auth/sign-in` - Login

### Core Features  
- `/api/search` - Find roommates or housing
- `/api/roommates/[id]` - Roommate details and reviews
- `/api/reviews` - Submit new reviews
- `/api/housing/*` - Housing location management

## Project Structure

```
app/
  api/              # API routes
  roommate/         # Roommate pages
  housing/          # Housing pages  
  search/           # Search functionality
components/         # React components
lib/               # Utils and config
supabase-schema.sql # Database setup
```

## Security

- Row Level Security on all database operations
- .edu email verification required
- Input validation and sanitization
- Rate limiting on API endpoints

## Contributing

Found bugs? Have ideas? Submit an [issue](https://github.com/pashiav/ratemyroommate/issues) or PR. 


## License

MIT - do whatever you want with it

---

**Note**: This platform is for sharing genuine experiences to help students make informed housing decisions. Don't use it to be vindictive or post fake reviews. We can tell the difference.
