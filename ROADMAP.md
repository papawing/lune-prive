# 🗺️ LUNE PRIVÉ - Development Roadmap

**4-Week MVP Timeline**
**Goal**: Production-ready matching platform with Airbnb-inspired design

---

## ✅ Week 1: Foundation & Authentication (COMPLETE)

### Completed Tasks
- [x] Next.js 15 project setup with TypeScript
- [x] Vercel Postgres + Prisma ORM configuration
- [x] Complete database schema (8 models: User, Member, Cast, CastPhoto, Bookmark, MeetingRequest, AdminLog)
- [x] Airbnb design system (Tailwind CSS v4 with custom tokens)
- [x] Multi-language support (EN/ZH/JA with 120 translation keys each)
- [x] NextAuth.js v5 authentication with Prisma adapter
- [x] Login page with email/password
- [x] Registration page (Member with file upload + Cast with profile fields)
- [x] Registration API with bcrypt password hashing
- [x] Shared Navbar with language switcher
- [x] Database seed script with test users
- [x] shadcn/ui components (12 installed)

**Deliverables**:
- ✅ Functional authentication system
- ✅ Multi-language homepage
- ✅ Database ready for data
- ✅ Test users (Admin, Member, Cast)

---

## ✅ Week 2: Browse & Discovery (COMPLETE)

### Completed Tasks

#### Task 1: Cast Browse Page ✅
**Route**: `/[locale]/(member)/browse/page.tsx`

**Features**:
- [x] Browse page layout with navbar and authentication
- [x] Server-side cast fetching with Prisma
- [x] Tier-based filtering (Basic: STANDARD, Premium: all)
- [x] Responsive grid (xl:4 → lg:3 → sm:2 → 1 column)
- [x] Featured casts horizontal scroll section
- [x] Upgrade CTA for Basic members
- [x] Empty state handling
- [x] Multi-language support (EN/ZH/JA)

---

#### Task 2: Cast Card Component ✅
**Component**: `components/cast/CastCard.tsx`

**Features**:
- [x] 4:5 aspect ratio photo container
- [x] Gradient overlay on hover
- [x] Tier badge (gold for HIGH_CLASS)
- [x] Verification checkmark
- [x] Bookmark heart with bounce animation
- [x] Language badges (max 3 + overflow)
- [x] Hover lift + scale effects
- [x] Multi-language label support (EN/ZH/JA)
- [x] API integration for bookmark toggle

---

#### Task 3: Featured Casts Section ✅
**Implementation**: Integrated into browse page

**Features**:
- [x] Horizontal scroll container (300px cards)
- [x] Snap points for smooth scrolling
- [x] Filters by `isFeatured = true`
- [x] Separate from regular grid
- [x] Translated section heading

---

#### Task 4: Cast Detail Page ✅
**Route**: `/[locale]/(member)/browse/[castId]/page.tsx`

**Features**:
- [x] Airbnb photo gallery (1 large + 4 small grid)
- [x] Lightbox modal with prev/next navigation
- [x] Profile sidebar (name, age, location, languages)
- [x] Tier badge and verification checkmark
- [x] Bio, measurements, interests sections
- [x] Bookmark button integration
- [x] Request Meeting CTA button
- [x] First meeting info card
- [x] Back button navigation
- [x] Tier-based access control

---

#### Task 5: Photo Gallery Component ✅
**Component**: `components/cast/PhotoGallery.tsx`

**Features**:
- [x] 1+4 Airbnb grid layout
- [x] Empty state placeholder
- [x] Lightbox with navigation
- [x] Photo counter display
- [x] Responsive image handling
- [x] "+X more" indicator

---

#### Task 6: Bookmark System ✅
**API Routes**: `/api/bookmarks`

**Features**:
- [x] POST endpoint (create bookmark)
- [x] DELETE endpoint (remove bookmark)
- [x] BookmarkButton component
- [x] Optimistic UI updates
- [x] Error handling with revert
- [x] Bounce animation
- [x] Duplicate prevention (409 error)

---

#### Task 7: Meeting Request System ✅
**API Route**: `/api/meetings/request`

**Features**:
- [x] POST endpoint (create request)
- [x] RequestMeetingButton component
- [x] Tier-based validation
- [x] Duplicate request prevention
- [x] PENDING status creation
- [x] Loading state handling
- [x] Redirect to meetings page (future)

---

### Week 2 Deliverables ✅
- [x] Browse page with tier-based filtering
- [x] Cast card component (Airbnb-style)
- [x] Featured section (horizontal scroll)
- [x] Cast detail page with photo gallery
- [x] Lightbox modal
- [x] Bookmark system (API + UI)
- [x] Meeting request system (API + button)
- [x] Multi-language support (13 new keys)
- [x] Responsive design (mobile, tablet, desktop)
- [x] Production build successful

**Total Completed**: ~15 hours
**Status**: ✅ **COMPLETE** - Ready for database setup

### Remaining Features (Optional Enhancements):
- [ ] Filter system (age, location, languages, interests)
- [ ] Bookmarks page (`/[locale]/bookmarks`)
- [ ] Infinite scroll or pagination
- [ ] Skeleton loading states

---

## 📅 Week 3: Meetings & Admin Dashboard

### Priority Tasks

#### Task 1: Meeting Request System (3-4 hours)

**Member Side**:
- [ ] "Request Meeting" button on cast detail page
- [ ] Confirmation modal: "Request meeting with [Cast Name]?"
- [ ] Request API: Create MeetingRequest record (status: PENDING)
- [ ] Requests page: `/[locale]/(member)/requests`
  - Show all meeting requests with status
  - Pending: "Waiting for admin coordination"
  - Confirmed: Show date, time, location

**Cast Side**:
- [ ] Requests page: `/[locale]/(cast)/requests`
  - See incoming requests
  - See member profiles (who requested)
  - Cannot accept/reject directly (admin coordinates)

**Status**: 🔄 NOT STARTED

**API Routes**:
```typescript
POST /api/meetings/request  ✅ COMPLETE (Week 2)
Body: { castId: string }
Response: { success: boolean, request: MeetingRequest }

GET /api/meetings/my-requests
Response: { requests: MeetingRequest[] }
```

---

#### Task 2: Admin Dashboard Layout (2-3 hours)
**Route**: `/[locale]/(admin)/dashboard/page.tsx`

**Layout**:
```
┌─────────────────────────────────────────────┐
│ ☰ Lune Privé Admin                [Admin ▼] │
├─────┬───────────────────────────────────────┤
│     │                                        │
│ 📊  │  Dashboard Overview                   │
│ 👥  │  ──────────────────────────────       │
│ 💃  │                                        │
│ 📅  │  ┌────────┐ ┌────────┐ ┌────────┐   │
│ 📝  │  │Pending │ │Active  │ │Pending │   │
│     │  │Members │ │Casts   │ │Requests│   │
│     │  │   12   │ │   45   │ │    8   │   │
│     │  └────────┘ └────────┘ └────────┘   │
│     │                                        │
│     │  Recent Actions                       │
│     │  ──────────────────────────────       │
│     │  ⚠️ 3 members awaiting verification  │
│     │  ⚠️ 2 casts pending approval          │
│     │  [Review Now]                          │
└─────┴───────────────────────────────────────┘
```

**Sidebar Navigation**:
- Dashboard (📊)
- Members (👥) - Verification queue
- Casts (💃) - Create/manage casts
- Meeting Requests (📅) - Coordination
- Activity Log (📝)

---

#### Task 3: Member Verification Queue (2-3 hours)
**Route**: `/[locale]/(admin)/members/page.tsx`

**Features**:
- [ ] Table of pending members
- [ ] Show: nickname, email, tier, registration date
- [ ] Click to view ID + income proof documents
- [ ] Quick actions: Approve ✓ / Reject ✗
- [ ] Mark as paid toggle
- [ ] Change tier (Basic ↔ Premium)

**API Routes**:
```typescript
GET /api/admin/members/pending
Response: { members: Member[] }

POST /api/admin/members/:id/verify
Body: { status: 'APPROVED' | 'REJECTED', notes?: string }

POST /api/admin/members/:id/update-tier
Body: { tier: 'BASIC' | 'PREMIUM', isPaid: boolean }
```

---

#### Task 4: Cast Management (3-4 hours)
**Route**: `/[locale]/(admin)/casts/page.tsx`

**Features**:
- [ ] Create new cast profile (form)
- [ ] Upload cast photos (multiple)
- [ ] Set profile details (age, location, languages, interests, bio)
- [ ] Assign tier (STANDARD / HIGH_CLASS)
- [ ] Set featured status
- [ ] Activate/deactivate cast
- [ ] Edit existing cast profiles
- [ ] Verify individual photos (checkmark)

**Cast Profile Form Fields**:
```typescript
{
  nickname: string
  age: number
  location: string
  languages: string[]  // multi-select
  interests: string[]  // tags
  bodyMeasurements: string
  bio: string  // textarea
  tierClassification: 'STANDARD' | 'HIGH_CLASS'
  isFeatured: boolean
  isActive: boolean
  photos: File[]  // 3-10 photos
}
```

---

#### Task 5: Meeting Coordination (2-3 hours)
**Route**: `/[locale]/(admin)/requests/page.tsx`

**Features**:
- [ ] Table of pending meeting requests
- [ ] Show: Member name, Cast name, requested date
- [ ] Click to expand details
- [ ] Coordination form:
  - Scheduled date (date + time picker)
  - Lune location (dropdown: Roppongi Main, Shibuya, etc.)
  - Admin notes (textarea)
- [ ] Confirm button → status = CONFIRMED
- [ ] Cancel button → status = CANCELLED
- [ ] Both member & cast see updated status

**API Route**:
```typescript
POST /api/admin/meetings/:id/coordinate
Body: {
  scheduledDate: Date
  luneLocation: string
  adminNotes?: string
  status: 'CONFIRMED' | 'CANCELLED'
}
```

---

### Week 3 Deliverables
- ✅ Meeting request system (member → cast)
- ✅ Admin dashboard with stats
- ✅ Member verification queue
- ✅ Cast management (create, edit, activate)
- ✅ Meeting coordination interface
- ✅ Activity log

**Total Estimated Time**: 14-18 hours

---

## 🚀 Week 4: Polish, Testing & Deployment

### Priority Tasks

#### Task 1: Mobile Optimization (2-3 hours)
- [ ] Test all pages on mobile (iOS Safari, Android Chrome)
- [ ] Bottom tab navigation (mobile only)
- [ ] Touch-friendly targets (min 44px)
- [ ] Swipe gestures for galleries
- [ ] Responsive images (optimized for mobile)
- [ ] Filter drawer (slides up from bottom on mobile)

---

#### Task 2: Photo Upload & Gallery (2-3 hours)
- [ ] Integrate Vercel Blob storage
- [ ] Image compression (client-side before upload)
- [ ] Progress indicators
- [ ] Error handling
- [ ] Photo reordering (drag & drop)
- [ ] Delete photos

---

#### Task 3: Security Audit (2-3 hours)
- [ ] File upload validation (types, sizes)
- [ ] CSRF protection (verify Next.js built-in)
- [ ] SQL injection prevention (verify Prisma)
- [ ] XSS prevention (verify React escaping)
- [ ] Rate limiting (API routes)
- [ ] Role-based access verification
- [ ] Session timeout handling

---

#### Task 4: Performance Optimization (2-3 hours)
- [ ] Image optimization (Next.js Image component)
- [ ] Lazy loading (images, components)
- [ ] Code splitting (dynamic imports)
- [ ] Bundle size analysis
- [ ] Lighthouse audit (aim for 90+ score)
- [ ] Loading states (skeletons)
- [ ] Error boundaries

---

#### Task 5: Testing (3-4 hours)
- [ ] Authentication flow (login, register, logout)
- [ ] Multi-language switching
- [ ] Browse → Filter → Detail → Bookmark flow
- [ ] Meeting request flow
- [ ] Admin verification flow
- [ ] Admin cast creation flow
- [ ] Admin meeting coordination
- [ ] Mobile responsiveness
- [ ] Cross-browser testing (Chrome, Safari, Firefox)

---

#### Task 6: Documentation (1-2 hours)
- [ ] Update README with deployment guide
- [ ] Create USER_GUIDE.md
- [ ] Create ADMIN_GUIDE.md
- [ ] API documentation
- [ ] Environment variables guide

---

#### Task 7: Deployment to Vercel (2-3 hours)
- [ ] Push to GitHub
- [ ] Import to Vercel
- [ ] Add Vercel Postgres
- [ ] Configure environment variables
- [ ] Add Vercel Blob storage
- [ ] Run migrations
- [ ] Seed production data (admin user)
- [ ] Test production URLs
- [ ] Set up custom domain (if available)
- [ ] Enable analytics
- [ ] Set up error monitoring (Sentry optional)

---

### Week 4 Deliverables
- ✅ Mobile-optimized
- ✅ Photo upload working
- ✅ Security audited
- ✅ Performance optimized
- ✅ Fully tested
- ✅ Deployed to production
- ✅ Documentation complete

**Total Estimated Time**: 14-18 hours

---

## 🎯 Success Criteria (MVP)

### Functional Requirements
- [x] User authentication (login, register)
- [ ] Member can browse casts (tier-based access)
- [ ] Member can filter casts (age, location, languages)
- [ ] Member can bookmark casts
- [ ] Member can request meetings
- [ ] Cast can view profile requests
- [ ] Admin can verify members
- [ ] Admin can create/manage casts
- [ ] Admin can coordinate meetings
- [ ] Multi-language support (EN/ZH/JA)

### Non-Functional Requirements
- [ ] Mobile responsive (works on iPhone, Android)
- [ ] Fast page loads (<3s on 3G)
- [ ] Secure (no obvious vulnerabilities)
- [ ] Accessible (WCAG 2.1 AA basics)
- [ ] SEO-friendly (meta tags, sitemap)
- [ ] Error handling (user-friendly messages)

### Design Requirements
- [x] Airbnb-inspired visual design
- [ ] Smooth animations (hover, click, transitions)
- [ ] Consistent color palette (coral, gold, teal)
- [ ] Professional typography
- [ ] High-quality photos (4:5 ratio)
- [ ] Verified badges
- [ ] Tier badges (gold for premium)

---

## 📊 Progress Tracking

| Week | Phase | Status | Progress |
|------|-------|--------|----------|
| 1 | Foundation & Auth | ✅ Complete | 100% |
| 2 | Browse & Discovery | 🚧 In Progress | 0% |
| 3 | Meetings & Admin | 📋 Planned | 0% |
| 4 | Polish & Deploy | 📋 Planned | 0% |

**Overall MVP Progress**: 25% (Week 1 complete)

---

## 🔮 Post-MVP Enhancements (Future)

### Phase 2 (Month 2)
- [ ] Payment integration (Stripe)
  - Member tier subscriptions
  - Per-meeting fees
  - Auto-update isPaid status
- [ ] Email notifications
  - Registration confirmation
  - Verification approved
  - Meeting confirmed
- [ ] Push notifications (web push)
- [ ] Member reviews/ratings
- [ ] Cast analytics dashboard

### Phase 3 (Month 3+)
- [ ] Advanced search & recommendations
- [ ] Cast availability calendar
- [ ] In-app chat (admin ↔ users)
- [ ] Video profiles (short intro videos)
- [ ] Native mobile apps (React Native)
  - iOS app
  - Android app
  - Push notifications
- [ ] Admin analytics
  - Revenue tracking
  - User growth charts
  - Popular casts
  - Conversion rates

---

## 📝 Notes & Reminders

### Development Principles
- **Mobile-first**: Design for mobile, enhance for desktop
- **Airbnb DNA**: Depth, dimension, smooth animations
- **Type-safe**: Use TypeScript everywhere
- **User-centric**: Prioritize user experience
- **Secure by default**: Never compromise security

### Code Standards
- **Components**: One component per file
- **Naming**: PascalCase for components, camelCase for functions
- **Imports**: Absolute paths with @ alias
- **Comments**: Explain why, not what
- **Commit messages**: Clear, descriptive (use conventional commits)

### Testing Strategy
- **Manual testing**: Every feature before marking complete
- **Browser testing**: Chrome, Safari, Firefox
- **Device testing**: Desktop, tablet, mobile
- **User flow testing**: End-to-end scenarios
- **Performance testing**: Lighthouse audit

---

**Last Updated**: November 9, 2025
**Current Focus**: Week 2 - Browse Page & Cast Cards
**Next Milestone**: Browse page with filtering (3-4 days)
