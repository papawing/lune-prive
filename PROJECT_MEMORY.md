# 🧠 LUNE PRIVÉ - Project Memory & Context

**Last Updated**: November 9, 2025
**Project Status**: Week 2 Complete (Browse & Discovery Features)
**Next Session**: Week 3 - Admin Dashboard & Meeting Management

---

## 🎯 Project Overview

**Project Name**: Lune Privé
**Type**: High-end matching platform (Sugar daddy style)
**Brand**: Lune Roppongi
**Design Inspiration**: Airbnb 2025 design system

### Core Concept
- Members (men) browse and request meetings with Casts (girls)
- All first meetings happen at Lune Roppongi (safe environment)
- Admin coordinates all bookings
- No direct messaging between members and casts
- Tier-based access system

---

## 👥 User Roles & Permissions

### 1. Admin
**Access**: Full system control
**Capabilities**:
- Approve/reject member verifications (ID + income proof)
- Create and manage cast profiles
- Assign cast tiers (Standard / High-Class)
- Coordinate meeting bookings
- Mark members as paid
- Set featured casts
- View analytics

### 2. Member (Men)
**Tiers**:
- **Basic**: See Standard casts only
- **Premium**: See all casts (Standard + High-Class)

**Capabilities**:
- Browse casts with filters
- Bookmark favorite casts
- Request meetings
- View booking history
- Cannot message casts directly

**Verification Required**:
- ID document upload
- Income proof upload
- Manual admin approval

**Payment**: Managed manually by admin (isPaid flag)

### 3. Cast (Girls)
**Tiers** (Admin-assigned):
- **Standard**: Visible to Basic + Premium members
- **High-Class**: Visible to Premium members only

**Capabilities**:
- Manage profile (photos, bio, availability)
- See who bookmarked them
- View meeting requests
- See member profiles (only those who bookmarked/requested)

**Verification**: Admin creates or approves profiles

---

## 🗄️ Database Schema (Key Decisions)

### User Model
- Roles: ADMIN, MEMBER, CAST
- Verification status: PENDING, APPROVED, REJECTED
- Locale preference stored (en/zh/ja)

### Member Model
- Tier: BASIC, PREMIUM
- isPaid: boolean (manually updated by admin)
- Document URLs stored (ID + income proof)

### Cast Model
- tierClassification: STANDARD, HIGH_CLASS (admin assigns)
- isFeatured: boolean (for homepage featured section)
- isActive: boolean (admin activates)
- Photos: 3-10 photos, admin can verify individual photos
- Languages: array (supports multiple)
- Interests: array (for filtering)

### MeetingRequest Flow
1. Member requests meeting
2. Status: PENDING
3. Admin contacts cast externally (phone/LINE)
4. Admin updates: scheduledDate, luneLocation, adminNotes
5. Status: CONFIRMED
6. Both parties see confirmation
7. Meeting happens at Lune
8. Status can update to COMPLETED or CANCELLED

### Bookmark System
- Simple: Member ↔ Cast relationship
- When member bookmarks cast → cast can see member profile

---

## 🎨 Design System (Airbnb 2025 Inspiration)

### Research Sources
- [Airbnb 2025 Summer Release](https://news.airbnb.com/airbnb-2025-summer-release/)
- Airbnb Design Language System (DLS)

### Color Palette (LUNE PRIVÉ Teal Theme - Nov 2025 Update)
```css
/* Primary Colors - From Favicon Crescent Moon */
Primary Teal: #4A9B8E     /* LUNE PRIVÉ signature - CTAs, buttons */
Mint Green: #A8D5C5       /* Light teal accent */
Deep Teal: #2D7A6E        /* Dark teal for depth */

/* Luxury Accents */
Gold Vibrant: #FFD700     /* Premium tier badges */
Champagne: #F7E7CE        /* Premium backgrounds */
Moonlight Green: #68BDA8  /* Moonlit elegance */

/* Semantic Colors */
Success Teal: #00A699     /* Success, verified badges */
Warning Orange: #FC642D   /* Warnings */
Error Red: #C13515        /* Errors */

/* Neutrals */
Deep Gray: #484848        /* Primary text */
Light Gray: #767676       /* Secondary text */
Gray-50: #F7F7F7         /* Backgrounds */
```

**Color Update History**:
- **Nov 2025**: Transitioned from Airbnb pink (#FF385C) to LUNE PRIVÉ teal theme (#4A9B8E) based on favicon crescent moon design

### Key Design Principles
- **Dimensional over flat**: Use shadows, depth, 3D effects
- **8px spacing grid**: Consistent rhythm
- **12px border radius**: Airbnb signature
- **Smooth animations**: Bounce hearts, card lifts, fade-ins
- **Photo-first**: Large images, 4:5 aspect ratio for portraits

### Typography
- **Primary**: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI)
- **Display**: Playfair Display (luxury serif for headings)
- **Logo**: "LUNE PRIVÉ" in Playfair Display

### Animations
```css
bounce-heart: 0.4s      /* Bookmark button */
lift-card: 0.2s         /* Hover on cast cards */
shimmer: 2s infinite    /* Loading skeleton */
fade-in-up: 0.3s        /* Page transitions */
```

---

## 🌍 Multi-Language System

### Supported Languages
1. **English (en)** - Default
2. **Chinese (zh)** - 中文
3. **Japanese (ja)** - 日本語

### Implementation
- **next-intl** for i18n
- **URL-based routing**: `/en`, `/zh`, `/ja`
- **107 translation keys** per language
- All keys synchronized across languages
- User locale preference stored in database

### Translation Coverage
- Common UI (buttons, navigation, forms)
- Auth pages (login, register, verification)
- Member features (browse, bookmarks, requests)
- Cast features (profile, availability)
- Admin features (dashboard, verification, coordination)
- Meeting system (requests, confirmation, location)

---

## 🛠️ Tech Stack & Architecture

### Frontend
- **Next.js 15** (App Router)
- **React 19.2.0**
- **TypeScript 5**
- **Tailwind CSS v4** (with custom Airbnb theme)
- **shadcn/ui** components

### Backend & Database
- **Vercel Postgres** (Neon-powered)
- **Prisma ORM** (type-safe queries)
- **NextAuth.js v5** (authentication)
- **bcryptjs** (password hashing)

### Storage
- **Vercel Blob** (for photo/document uploads)
- Conditional: only uploads if BLOB_READ_WRITE_TOKEN set

### Deployment
- **Vercel** (all-in-one hosting)
- Serverless functions for API routes
- Edge middleware for i18n

---

## 📁 Project Structure

```
lune-prive/
├── app/
│   ├── [locale]/              # Locale-based routing
│   │   ├── (auth)/           # Auth routes (login, register)
│   │   ├── (member)/         # Member routes (browse, bookmarks)
│   │   ├── (cast)/           # Cast routes (profile)
│   │   ├── (admin)/          # Admin routes (dashboard)
│   │   ├── api/              # API routes
│   │   ├── layout.tsx        # Locale layout
│   │   └── page.tsx          # Homepage
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Airbnb design tokens
├── components/
│   ├── ui/                   # shadcn components (12 installed)
│   ├── shared/               # Navbar, Footer
│   ├── cast/                 # CastCard, PhotoGallery, BookmarkButton
│   └── member/               # RequestMeetingButton
├── lib/
│   ├── auth.ts               # NextAuth config
│   ├── prisma.ts             # DB client
│   └── utils.ts              # Utilities
├── i18n/
│   ├── config.ts             # Locale configuration
│   ├── routing.ts            # Routing setup
│   └── request.ts            # Request handler
├── messages/
│   ├── en.json               # English translations (120 keys)
│   ├── zh.json               # Chinese translations (120 keys)
│   └── ja.json               # Japanese translations (120 keys)
├── prisma/
│   ├── schema.prisma         # Database schema (8 models)
│   └── seed.ts               # Test data seeding
├── types/
│   └── next-auth.d.ts        # NextAuth types
├── middleware.ts             # i18n middleware
└── next.config.ts            # Next.js + i18n config
```

---

## ✅ Completed Features (Week 1)

### Foundation
- [x] Next.js 15 project setup
- [x] TypeScript configuration
- [x] Tailwind CSS v4 with Airbnb design system
- [x] Project structure with locale routing

### Database
- [x] Prisma schema (8 models)
- [x] User, Member, Cast models
- [x] MeetingRequest, Bookmark models
- [x] CastPhoto, AdminLog models
- [x] Enums for roles, tiers, statuses
- [x] Database seed script with test users

### Multi-Language
- [x] next-intl configuration
- [x] 3 languages (EN/ZH/JA)
- [x] 120 translation keys per language
- [x] URL-based routing (/en, /zh, /ja)
- [x] Language switcher in navbar

### Authentication
- [x] NextAuth.js v5 setup
- [x] Prisma adapter
- [x] Login page with email/password
- [x] Registration page (tabbed: Member/Cast)
- [x] Registration API with file upload support
- [x] Password hashing (bcryptjs)
- [x] JWT session strategy
- [x] Role-based authentication

### UI Components
- [x] Shared Navbar (logo, links, language switcher, auth buttons)
- [x] Login form (card-based)
- [x] Registration forms (Member with uploads, Cast with profile fields)
- [x] 12 shadcn/ui components installed
- [x] Airbnb-style buttons, cards, inputs

### Test Data
- [x] Admin: admin@lune-prive.com / admin123
- [x] Cast: sakura@example.com / cast123
- [x] Member: john@example.com / member123

---

## ✅ Completed Features (Week 2)

### Browse Page
- [x] `/[locale]/browse` route with member authentication
- [x] Tier-based filtering (Basic: STANDARD only, Premium: all)
- [x] Featured casts horizontal scroll section
- [x] Responsive grid (4→3→2→1 cols)
- [x] Upgrade CTA for Basic members
- [x] Empty state handling

### CastCard Component
- [x] 4:5 aspect ratio photo container
- [x] Gradient overlay on hover
- [x] Tier badge (gold for HIGH_CLASS)
- [x] Verification checkmark
- [x] Bookmark heart button with bounce animation
- [x] Language badges (max 3 + overflow)
- [x] Hover lift + scale effects
- [x] Multi-language label support

### Cast Detail Page
- [x] `/[locale]/browse/[castId]` route
- [x] Tier-based access control
- [x] Airbnb photo gallery (1 large + 4 small grid)
- [x] Lightbox modal with navigation
- [x] Profile sidebar (name, age, tier, languages, location, bio)
- [x] Bookmark button integration
- [x] Request Meeting CTA
- [x] First meeting info card
- [x] Back button navigation

### Photo Gallery
- [x] Airbnb-style grid layout
- [x] Empty state placeholder
- [x] Lightbox with prev/next navigation
- [x] Photo counter display
- [x] Responsive image handling

### Bookmark System
- [x] POST `/api/bookmarks` endpoint
- [x] DELETE `/api/bookmarks` endpoint
- [x] BookmarkButton component
- [x] Optimistic UI updates
- [x] Error handling with state revert
- [x] Bounce animation on toggle
- [x] Duplicate prevention (409 error)

### Meeting Request System
- [x] POST `/api/meetings/request` endpoint
- [x] RequestMeetingButton component
- [x] Tier-based access validation
- [x] Duplicate request prevention
- [x] MeetingRequest creation with PENDING status
- [x] Loading state handling

---

## 🚧 Next Steps (Week 3 Roadmap)

### Priority 1: Filter Bar (Week 2 Remaining)
- [ ] Age range slider component
- [ ] Location dropdown
- [ ] Languages multi-select
- [ ] Interests tag filter
- [ ] Sticky positioning below navbar
- [ ] Clear all filters button
- [ ] URL query params for filter state

### Priority 2: Bookmarks Page
- [ ] `/[locale]/bookmarks` route
- [ ] Display bookmarked casts in grid
- [ ] Remove bookmark action
- [ ] Empty state (no bookmarks)

### Priority 3: Admin Dashboard
- [ ] `/[locale]/admin/dashboard` route
- [ ] Stats cards (pending members, active casts, pending requests)
- [ ] Verification queue (members table)
- [ ] Quick approve/reject actions
- [ ] Cast management (create, edit, activate, set tier)
- [ ] Meeting requests coordination
- [ ] Activity log display

---

## 📋 Feature Specifications

### Browse Page Layout
```
┌─────────────────────────────────────────────┐
│ Navbar (fixed)                              │
├─────────────────────────────────────────────┤
│ Featured Casts (horizontal scroll)          │
│ [Photo] [Photo] [Photo] [Photo] →          │
├─────────────────────────────────────────────┤
│ Filters (sticky)                            │
│ [Age: 20-30] [Location ▼] [Languages ▼]   │
├─────────────────────────────────────────────┤
│ Cast Grid (4 columns)                       │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐               │
│ │Cast│ │Cast│ │Cast│ │Cast│               │
│ └────┘ └────┘ └────┘ └────┘               │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐               │
│ │Cast│ │Cast│ │Cast│ │Cast│               │
│ └────┘ └────┘ └────┘ └────┘               │
│ [Load More]                                 │
└─────────────────────────────────────────────┘
```

### Cast Card Component Spec
```typescript
<CastCard
  photo={cast.photos[0].photoUrl}
  name={cast.user.nickname}
  age={cast.age}
  languages={cast.languages}
  tier={cast.tierClassification}
  isVerified={cast.photos.some(p => p.isVerified)}
  isBookmarked={/* check if bookmarked */}
  onBookmark={/* toggle bookmark */}
  onClick={/* navigate to detail */}
/>
```

**Visual Design**:
- Photo: 4:5 aspect ratio, cover fit
- Gradient overlay: bottom 30% (transparent → rgba(0,0,0,0.6))
- Name + Age: White text on gradient
- Languages: Icon flags or text
- Tier badge: Gold gradient (HIGH_CLASS) or gray (STANDARD)
- Bookmark: Heart icon, top-right, white background with blur
- Verified badge: Teal checkmark, bottom-right
- Hover: translateY(-4px) + shadow increase
- Border radius: 12px (Airbnb signature)

### Admin Verification Queue
```
┌─────────────────────────────────────────────┐
│ Pending Member Verifications (12)           │
├─────────────────────────────────────────────┤
│ Name      Email           Tier    Actions   │
│ John Doe  john@...       Premium [✓][✗]    │
│ Documents: [ID] [Income]                    │
│ ────────────────────────────────────────    │
│ Jane Smith jane@...      Basic   [✓][✗]    │
│ Documents: [ID] [Income]                    │
└─────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

### Registration Flow
```
1. User visits /register
2. Chooses role: Member or Cast
3. Fills form + uploads documents (if Member)
4. Submits → Creates User + Member/Cast records
5. Verification status = PENDING
6. Admin approves in dashboard
7. Status → APPROVED
8. User can login
```

### Login Flow
```
1. User visits /login
2. Enters email + password
3. NextAuth validates credentials
4. Password compared with bcrypt
5. JWT token created with role + verification status
6. Session stored
7. Redirect based on role:
   - ADMIN → /admin/dashboard
   - MEMBER → /browse
   - CAST → /profile
```

### Authorization Checks
```typescript
// Middleware protects routes by role
/browse → requires MEMBER role + APPROVED status
/admin/* → requires ADMIN role
/profile → requires CAST role
```

---

## 🎨 Component Design Patterns

### Airbnb-Style Card
```css
.cast-card {
  border-radius: 12px;
  overflow: hidden;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.cast-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 28px rgba(0,0,0,0.16);
}
```

### Bookmark Button Animation
```css
@keyframes bounce-heart {
  0%, 100% { transform: scale(1); }
  25% { transform: scale(1.3); }
  50% { transform: scale(0.9); }
  75% { transform: scale(1.1); }
}

.bookmark-button.active {
  animation: bounce-heart 0.4s ease-out;
  color: #FF5A5F; /* Coral */
}
```

### Loading Skeleton
```css
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.skeleton {
  background: linear-gradient(
    to right,
    #f0f0f0 4%,
    #e0e0e0 25%,
    #f0f0f0 36%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
```

---

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start dev server (localhost:3000)
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# Database
npx prisma studio       # Open database GUI (localhost:5555)
npx prisma generate     # Generate Prisma Client
npx prisma db push      # Push schema to database
npx ts-node prisma/seed.ts  # Seed test data

# Testing
npx tsc --noEmit       # Check TypeScript errors
```

---

## 🐛 Known Issues & Decisions

### Middleware Deprecation Warning
- **Issue**: Next.js 16 shows middleware deprecation warning
- **Status**: Cosmetic only, doesn't affect functionality
- **Action**: Can ignore for now, update to "proxy" convention later

### File Upload
- **Decision**: Vercel Blob storage ready but optional
- **Behavior**: Files only upload if `BLOB_READ_WRITE_TOKEN` is set
- **Fallback**: Registration works without token (no file URLs stored)

### Session Strategy
- **Decision**: JWT instead of database sessions
- **Reason**: Better performance with serverless
- **Trade-off**: Can't invalidate sessions server-side (need to wait for token expiry)

---

## 🎯 Business Rules

### Meeting Coordination
- **First meeting location**: Always at Lune Roppongi
- **Admin role**: Coordinates all bookings (not automated)
- **Communication**: Admin contacts cast externally (phone/LINE)
- **No direct messaging**: Members and casts can't message each other
- **After first meeting**: Users decide privately how to continue

### Tier Access Control
- **Basic members**: See STANDARD casts only
- **Premium members**: See all casts (STANDARD + HIGH_CLASS)
- **Cast visibility**: Controlled by tierClassification (admin assigns)

### Verification
- **Members**: Must upload ID + income proof → Admin approves
- **Casts**: Admin creates profile OR cast registers → Admin approves
- **Timing**: Manual review (depends on admin availability)

### Payment
- **Management**: Manual (admin marks isPaid = true)
- **Future**: Can integrate Stripe for automation
- **Current**: Payment happens outside the system

---

## 📝 Environment Variables

### Required
```bash
DATABASE_URL="postgresql://..."     # Vercel Postgres connection
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="random-secret-here"
```

### Optional
```bash
BLOB_READ_WRITE_TOKEN="vercel_blob_xxx"  # For file uploads
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] Set environment variables in Vercel
- [ ] Push database schema (`npx prisma migrate deploy`)
- [ ] Seed admin user
- [ ] Test login/register flows
- [ ] Test multi-language switching
- [ ] Verify mobile responsiveness

### Vercel Setup
- [ ] Import GitHub repository
- [ ] Add Vercel Postgres database
- [ ] Copy DATABASE_URL to environment variables
- [ ] Generate NEXTAUTH_SECRET
- [ ] (Optional) Add Vercel Blob storage
- [ ] Deploy!

### Post-Deployment
- [ ] Test production URLs
- [ ] Verify i18n routing (/en, /zh, /ja)
- [ ] Check authentication flow
- [ ] Test file uploads (if Blob enabled)
- [ ] Monitor error logs

---

## 💡 Future Enhancements (Beyond MVP)

### Phase 3 Ideas
- Email notifications (SendGrid/Resend)
- Push notifications (web push API)
- Member reviews/ratings (after meetings)
- Cast analytics (view counts, bookmark counts)
- Advanced search (height, style preferences)
- Cast availability calendar (date picker)
- Payment integration (Stripe)
- Chat system (Socket.io for admin ↔ users)
- Mobile apps (React Native)

---

## 📚 Key Resources

### Documentation
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js v5](https://authjs.dev/)
- [next-intl](https://next-intl.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)

### Design References
- [Airbnb 2025 Summer Release](https://news.airbnb.com/airbnb-2025-summer-release/)
- [Airbnb Design Language System](https://karrisaarinen.com/dls/)

---

## 🔄 Session Continuity

### Before Next Session
1. Review this PROJECT_MEMORY.md
2. Check ROADMAP.md for current priorities
3. Review last session's accomplishments in README.md

### Starting Next Session
```bash
# 1. Pull latest changes
git pull

# 2. Install dependencies (if needed)
npm install

# 3. Check database
npx prisma studio

# 4. Start dev server
npm run dev

# 5. Review current task in ROADMAP.md
```

---

**Last Session Summary**: Week 1 - Built complete foundation with authentication system
**Next Session Goal**: Build Browse Page with Airbnb-style cast cards and filters
**Status**: 100% ready to continue! 🚀
