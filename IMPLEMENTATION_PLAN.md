# Lune Privé Implementation Plan
## Cast & Member Matching Platform - Airbnb Design System

**Project**: Luxury cast-member matching platform
**Design Language**: Airbnb-inspired with premium enhancements
**Tech Stack**: Next.js 16, React 19, Tailwind CSS 4, Prisma, NextAuth

---

## 📋 Project Overview

### Platform Purpose
**Lune Privé** is an exclusive platform connecting premium hosts ("Casts") with verified members for luxury experiences. Think Airbnb meets exclusive hospitality with a focus on privacy, trust, and high-end service.

### User Types
1. **Casts** - Premium service providers/hosts
2. **Members** - Verified exclusive clientele
3. **Admins** - Platform moderators

---

## 🎯 Core Features (MVP)

### 1. Authentication & Profiles
- [x] NextAuth setup with Prisma adapter
- [ ] Cast registration with verification
- [ ] Member registration with approval process
- [ ] Profile creation with Airbnb-style cards
- [ ] Profile photo upload (Vercel Blob)
- [ ] Privacy settings

### 2. Search & Discovery
- [ ] Airbnb-style search bar (rounded, multi-field)
- [ ] Cast browsing with filters
- [ ] Map integration (location-based)
- [ ] Category/specialty filtering
- [ ] Advanced search options

### 3. Matching & Booking
- [ ] Cast availability calendar
- [ ] Booking request system
- [ ] Real-time availability check
- [ ] Pricing display
- [ ] Booking confirmation

### 4. Messaging
- [ ] Direct messaging between cast-member
- [ ] Notification system
- [ ] Message history
- [ ] Read receipts

### 5. Trust & Safety
- [ ] Identity verification
- [ ] Review system
- [ ] Trust badges
- [ ] Privacy controls
- [ ] Reporting system

---

## 🎨 Design Implementation Phases

### Phase 1: Foundation Components (Week 1-2)

#### Component Library Setup
```
components/ui/
├── Button.tsx          ✅ Airbnb gradient primary button
├── Card.tsx            ✅ Profile/listing cards with hover lift
├── Input.tsx           ✅ Form inputs with Airbnb styling
├── Select.tsx          ✅ Dropdown with custom styling
├── Avatar.tsx          ✅ User avatars with badges
├── Badge.tsx           ✅ Trust/premium indicators
└── Modal.tsx           ✅ Large rounded dialogs
```

**Tasks**:
- [ ] Create base Button component with Airbnb gradient
- [ ] Build reusable Card component (20:19 ratio support)
- [ ] Style form inputs with Airbnb aesthetics
- [ ] Implement Modal with XL rounded corners
- [ ] Add Badge variants (premium, verified, exclusive)

#### Layout Structure
```
app/[locale]/
├── layout.tsx          ✅ Root layout with header/footer
├── (auth)/
│   ├── login/          ✅ Airbnb-style auth forms
│   └── register/       ✅ Multi-step registration
├── (cast)/
│   ├── browse/         ✅ Cast discovery grid
│   └── [id]/           ✅ Cast profile detail
└── (member)/
    ├── dashboard/      ✅ Member control panel
    └── bookings/       ✅ Booking management
```

**Tasks**:
- [ ] Design navigation header (sticky, Airbnb style)
- [ ] Create footer with luxury branding
- [ ] Build responsive grid layouts
- [ ] Implement search bar component

### Phase 2: Cast Features (Week 3-4)

#### Cast Discovery
```tsx
// Cast browsing page with Airbnb grid
app/(cast)/browse/page.tsx
- Grid layout (1/2/3/4 cols responsive)
- Cast cards with hover effects
- Infinite scroll or pagination
- Filter sidebar
```

**Components Needed**:
- [ ] `CastCard.tsx` - Profile card with image, name, specialty, rating
- [ ] `CastGrid.tsx` - Responsive grid wrapper
- [ ] `FilterPanel.tsx` - Advanced filtering interface
- [ ] `SearchBar.tsx` - Multi-field Airbnb-style search

#### Cast Profile
```tsx
// Detailed cast profile with booking
app/(cast)/[id]/page.tsx
- Hero section with photos (carousel)
- About/description section
- Specialties & services
- Availability calendar
- Reviews section
- Booking panel (sticky)
```

**Components Needed**:
- [ ] `CastHero.tsx` - Image carousel with indicators
- [ ] `CastAbout.tsx` - Rich text description
- [ ] `BookingPanel.tsx` - Sticky booking interface
- [ ] `ReviewList.tsx` - Review cards with ratings
- [ ] `AvailabilityCalendar.tsx` - Date selection

### Phase 3: Member Features (Week 5-6)

#### Member Dashboard
```tsx
// Member control center
app/(member)/dashboard/page.tsx
- Upcoming bookings
- Favorite casts
- Message inbox preview
- Profile completion status
```

**Components Needed**:
- [ ] `DashboardCard.tsx` - Stat/info cards
- [ ] `UpcomingBookings.tsx` - Booking list/cards
- [ ] `FavoritesList.tsx` - Saved casts grid
- [ ] `QuickActions.tsx` - CTA buttons

#### Booking Management
```tsx
// Member bookings view
app/(member)/bookings/page.tsx
- Active bookings
- Past bookings
- Booking details modal
- Cancellation flow
```

**Components Needed**:
- [ ] `BookingCard.tsx` - Individual booking display
- [ ] `BookingDetails.tsx` - Expanded view modal
- [ ] `BookingStatus.tsx` - Status indicator
- [ ] `CancellationModal.tsx` - Cancel flow

### Phase 4: Interactions (Week 7-8)

#### Messaging System
```tsx
// Direct messaging interface
app/(member)/messages/page.tsx
- Conversation list
- Message thread view
- Real-time updates
- File/image sharing
```

**Components Needed**:
- [ ] `ConversationList.tsx` - Chat list sidebar
- [ ] `MessageThread.tsx` - Message display
- [ ] `MessageInput.tsx` - Compose interface
- [ ] `MessageBubble.tsx` - Individual message

#### Matching Algorithm
```typescript
// Smart cast-member matching
lib/matching/
├── algorithm.ts        // Matching logic
├── preferences.ts      // User preferences
└── scoring.ts          // Compatibility scoring
```

**Tasks**:
- [ ] Build preference collection system
- [ ] Implement matching algorithm
- [ ] Create recommendation engine
- [ ] Add "Perfect Match" indicators

---

## 🗄️ Database Schema

### Core Models (Prisma)

```prisma
// User types
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  role          Role      @default(MEMBER)
  emailVerified DateTime?

  // Relations
  accounts      Account[]
  sessions      Session[]
  castProfile   CastProfile?
  memberProfile MemberProfile?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  MEMBER
  CAST
  ADMIN
}

// Cast profile
model CastProfile {
  id           String   @id @default(cuid())
  userId       String   @unique
  user         User     @relation(fields: [userId], references: [id])

  // Profile data
  bio          String?
  specialties  String[]
  location     String?
  hourlyRate   Decimal?
  verified     Boolean  @default(false)
  premiumTier  Boolean  @default(false)

  // Media
  photos       String[]
  videoUrl     String?

  // Stats
  rating       Decimal?
  reviewCount  Int      @default(0)

  // Relations
  bookings     Booking[]
  reviews      Review[]
  availability Availability[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Member profile
model MemberProfile {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id])

  // Verification
  verified    Boolean  @default(false)
  premiumTier Boolean  @default(false)

  // Preferences
  preferences Json?

  // Relations
  bookings    Booking[]
  reviews     Review[]
  favorites   Favorite[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Booking system
model Booking {
  id            String        @id @default(cuid())
  castId        String
  cast          CastProfile   @relation(fields: [castId], references: [id])
  memberId      String
  member        MemberProfile @relation(fields: [memberId], references: [id])

  // Booking details
  startDate     DateTime
  endDate       DateTime
  totalPrice    Decimal
  status        BookingStatus @default(PENDING)

  // Messages
  messages      Message[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}

// Reviews
model Review {
  id       String        @id @default(cuid())
  castId   String
  cast     CastProfile   @relation(fields: [castId], references: [id])
  memberId String
  member   MemberProfile @relation(fields: [memberId], references: [id])

  rating   Int           // 1-5 stars
  comment  String?

  createdAt DateTime @default(now())
}

// Messaging
model Message {
  id        String   @id @default(cuid())
  bookingId String
  booking   Booking  @relation(fields: [bookingId], references: [id])

  senderId  String
  content   String
  read      Boolean  @default(false)

  createdAt DateTime @default(now())
}

// Favorites
model Favorite {
  id       String        @id @default(cuid())
  memberId String
  member   MemberProfile @relation(fields: [memberId], references: [id])
  castId   String

  createdAt DateTime @default(now())

  @@unique([memberId, castId])
}

// Availability
model Availability {
  id      String      @id @default(cuid())
  castId  String
  cast    CastProfile @relation(fields: [castId], references: [id])

  date    DateTime
  slots   Json        // Available time slots

  @@unique([castId, date])
}
```

---

## 🎨 Styling Guidelines

### Tailwind Utility Patterns

#### Cards (Airbnb Style)
```tsx
<div className="
  group
  overflow-hidden
  rounded-airbnb-md
  bg-white
  shadow-airbnb-md
  hover:shadow-airbnb-hover
  transition-shadow
  duration-base
">
  <div className="aspect-airbnb overflow-hidden">
    <img className="
      w-full h-full object-cover
      group-hover:scale-105
      transition-transform
      duration-slow
    " />
  </div>
  <div className="p-4 space-y-2">
    {/* Content */}
  </div>
</div>
```

#### Buttons
```tsx
// Primary (Gradient)
<button className="
  px-6 py-3
  bg-gradient-rausch
  text-white
  font-semibold
  rounded-lg
  hover:scale-[1.02]
  transition-transform
  duration-fast
  shadow-md
">

// Secondary (Outline)
<button className="
  px-6 py-3
  border-2 border-deep
  text-deep
  font-semibold
  rounded-lg
  hover:bg-gray-50
  transition-colors
  duration-fast
">
```

#### Search Bar
```tsx
<div className="
  flex items-center gap-4
  px-6 py-3
  bg-white
  rounded-full
  shadow-airbnb-md
  hover:shadow-airbnb-lg
  transition-shadow
">
  {/* Multi-field search */}
</div>
```

---

## 🔧 Technical Setup

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://..."

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."

# Storage (Vercel Blob)
BLOB_READ_WRITE_TOKEN="..."

# Email (Resend)
RESEND_API_KEY="..."

# Payments (Stripe) - Future
STRIPE_SECRET_KEY="..."
```

### Scripts
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "db:push": "prisma db push",
  "db:studio": "prisma studio",
  "db:seed": "ts-node prisma/seed.ts"
}
```

---

## 📅 Timeline

### Week 1-2: Foundation
- ✅ Project setup (Next.js, Prisma, Auth)
- ✅ Design system implementation (CSS variables)
- [ ] Base UI components (Button, Card, Input)
- [ ] Layout structure (Header, Footer)
- [ ] Auth pages (Login, Register)

### Week 3-4: Cast Features
- [ ] Cast registration flow
- [ ] Cast profile creation
- [ ] Cast browsing/discovery
- [ ] Cast detail pages
- [ ] Search functionality

### Week 5-6: Member Features
- [ ] Member registration/verification
- [ ] Member dashboard
- [ ] Booking system
- [ ] Favorites/saved casts
- [ ] Profile management

### Week 7-8: Interactions
- [ ] Messaging system
- [ ] Review system
- [ ] Notifications
- [ ] Matching algorithm
- [ ] Polish & refinement

### Week 9-10: Launch Prep
- [ ] Testing (E2E, integration)
- [ ] Performance optimization
- [ ] Security audit
- [ ] Content/copy writing
- [ ] Beta launch

---

## 🚀 Next Steps

### Immediate (This Week)
1. Create base UI components library
2. Build authentication flows
3. Set up database schema
4. Design cast card component

### Short Term (Next 2 Weeks)
1. Implement cast registration
2. Build cast browsing page
3. Create search functionality
4. Develop booking system

### Medium Term (Next Month)
1. Complete member features
2. Add messaging system
3. Implement reviews
4. Build matching algorithm

---

## 📊 Success Metrics

### Technical
- [ ] Page load < 2s
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals (green)
- [ ] Zero critical security issues

### User Experience
- [ ] Registration completion > 80%
- [ ] Search-to-profile click > 40%
- [ ] Profile-to-booking > 15%
- [ ] Return visitor rate > 60%

### Business
- [ ] Cast signup rate
- [ ] Member approval rate
- [ ] Booking conversion
- [ ] Platform GMV

---

## 🛠️ Development Workflow

### Git Strategy
```bash
main              # Production
├── develop       # Development branch
├── feature/*     # Feature branches
└── hotfix/*      # Emergency fixes
```

### Component Development
1. Design in Figma (Airbnb kit reference)
2. Create component file
3. Add Storybook story (if using)
4. Implement with Tailwind
5. Add TypeScript types
6. Write tests
7. Code review
8. Merge to develop

---

**Status**: In Progress - Phase 1
**Last Updated**: November 2025
**Next Review**: After Week 2 completion
