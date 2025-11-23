# Airbnb Design System Implementation Guide
## Lune Privé - Cast & Member Matching Platform

---

## 🎨 Design Philosophy

### Core Principles from Airbnb (2025)

1. **Human-Centered Design** - Prioritize user needs and experiences
2. **Trust & Safety** - Build confidence through visual clarity and consistency
3. **Belonging Anywhere** - Create inclusive, welcoming experiences
4. **Tactile & Vibrant** - Use depth, animation, and visual richness (Summer 2025 update)
5. **Modular & Scalable** - Component-based architecture for consistency

### Lune Privé Adaptation

**Luxury Focus**: Airbnb's approachable design + high-end hospitality aesthetics
**Privacy First**: Discreet, sophisticated interface for exclusive member matching
**Connection Oriented**: Facilitate meaningful cast-member relationships

---

## 🎭 Visual Language

### Color System

#### Primary Palette (LUNE PRIVÉ Teal Theme)
```css
--color-teal: #4A9B8E          /* LUNE PRIVÉ primary (from favicon) */
--color-mint: #A8D5C5          /* Light teal accent */
--color-deep-teal: #2D7A6E     /* Dark teal for depth */
--color-deep: #222222          /* Primary text */
--color-light: #717171         /* Secondary text */
--color-babu: #00A699          /* Success/trust indicator */
--color-arches: #FC642D        /* Warning/highlight */
--color-hof: #484848           /* Muted elements */
```

#### Luxury Accents (Lune Privé)
```css
--color-gold-vibrant: #FFD700  /* Premium features */
--color-champagne: #F7E7CE     /* Subtle backgrounds */
--color-moonlight: #68BDA8     /* Moonlit elegance */
```

#### Neutrals & Grays
```css
--color-white: #FFFFFF
--color-gray-50: #F7F7F7       /* Subtle backgrounds */
--color-gray-100: #EBEBEB      /* Borders, dividers */
--color-gray-200: #DDDDDD
--color-gray-300: #CCCCCC
```

### Typography

#### Font Stack
```css
/* Primary - Circular (Airbnb's custom font) */
font-family: 'Circular', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Display - For luxury headlines */
font-family: 'Playfair Display', Georgia, serif;

/* Monospace - For data/codes */
font-family: 'SF Mono', Monaco, 'Courier New', monospace;
```

#### Font Weights
- **Book (400)**: Body text, descriptions
- **Medium (500)**: Subheadings, emphasis
- **Semibold (600)**: Headings, CTAs
- **Bold (700)**: Hero text, primary headings

#### Type Scale (Airbnb Standard)
```
Display: 48px / 3rem
H1: 32px / 2rem
H2: 26px / 1.625rem
H3: 22px / 1.375rem
H4: 18px / 1.125rem
Body: 16px / 1rem
Small: 14px / 0.875rem
Caption: 12px / 0.75rem
```

### Spacing System

**8px Grid System** (Airbnb Standard)
```css
--space-1: 4px    (0.25rem)
--space-2: 8px    (0.5rem)
--space-3: 12px   (0.75rem)
--space-4: 16px   (1rem)
--space-6: 24px   (1.5rem)
--space-8: 32px   (2rem)
--space-12: 48px  (3rem)
--space-16: 64px  (4rem)
```

**Macro Spacing (Sections)**
```css
--space-macro-sm: 16px
--space-macro-md: 24px
--space-macro-lg: 48px
--space-macro-xl: 80px
```

### Border Radius

**Airbnb Signature** (12-32px range)
```css
--radius-airbnb-sm: 12px   /* Buttons, small cards */
--radius-airbnb-md: 16px   /* Standard cards */
--radius-airbnb-lg: 20px   /* Featured cards */
--radius-airbnb-xl: 32px   /* Hero elements, modals */
```

### Elevation & Shadows

**5-Level System** (Airbnb Standard)
```css
/* Subtle - Form inputs, inactive cards */
--shadow-sm: 0 1px 2px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04);

/* Standard - Cards, dropdowns */
--shadow-md: 0 2px 4px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05);

/* Elevated - Featured cards, dialogs */
--shadow-lg: 0 6px 16px rgba(0,0,0,0.12);

/* High - Modals, overlays */
--shadow-xl: 0 12px 48px rgba(0,0,0,0.18);

/* Hover State - Interactive cards */
--shadow-hover: 0 8px 28px rgba(0,0,0,0.16);
```

---

## 🧱 Component Architecture

### 1. Cards (Profile/Listing)

**Airbnb Pattern**
```tsx
<div className="group relative overflow-hidden rounded-airbnb-md bg-white shadow-airbnb-md hover-lift">
  {/* Image - Airbnb 20:19 ratio */}
  <div className="aspect-airbnb overflow-hidden">
    <img
      src={image}
      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-slow"
    />
  </div>

  {/* Content */}
  <div className="p-4 space-y-2">
    <h3 className="font-semibold text-deep text-lg">Title</h3>
    <p className="text-light text-sm line-clamp-2">Description</p>

    {/* Price/Status */}
    <div className="flex items-center justify-between">
      <span className="text-deep font-semibold">$XX</span>
      <span className="text-babu text-sm">Available</span>
    </div>
  </div>
</div>
```

**Lune Privé Adaptation**
- Add luxury badge/indicator
- Include privacy level visual
- Premium member highlighting

### 2. Search Bar

**Airbnb Pattern** (Signature rounded search)
```tsx
<div className="flex items-center gap-4 px-6 py-3 bg-white rounded-full shadow-airbnb-md hover:shadow-airbnb-lg transition-shadow">
  <div className="flex-1 border-r border-gray-200 pr-4">
    <label className="text-xs font-semibold text-deep">Location</label>
    <input className="w-full text-sm text-light" placeholder="Where are you going?" />
  </div>

  <div className="flex-1 border-r border-gray-200 pr-4">
    <label className="text-xs font-semibold text-deep">Date</label>
    <input className="w-full text-sm text-light" placeholder="Add dates" />
  </div>

  <div className="flex-1 pr-4">
    <label className="text-xs font-semibold text-deep">Guests</label>
    <input className="w-full text-sm text-light" placeholder="Add guests" />
  </div>

  <button className="w-12 h-12 rounded-full bg-rausch text-white flex items-center justify-center hover:scale-105 transition-transform">
    <SearchIcon />
  </button>
</div>
```

### 3. Buttons

**Primary CTA** (Airbnb Gradient)
```tsx
<button className="btn-airbnb btn-airbnb-primary">
  Book Now
</button>

/* CSS */
.btn-airbnb-primary {
  background: linear-gradient(to right, #E61E4D 0%, #D70466 100%);
  color: white;
  padding: 14px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
}

.btn-airbnb-primary:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 28px rgba(230,30,77,0.3);
}
```

**Secondary** (Outline)
```tsx
<button className="px-6 py-3 border-2 border-deep text-deep rounded-lg font-semibold hover:bg-gray-50 transition-colors">
  Learn More
</button>
```

### 4. Navigation

**Airbnb Header Pattern**
```tsx
<header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
  <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
    {/* Logo */}
    <div className="flex items-center gap-2">
      <Logo className="w-8 h-8 text-rausch" />
      <span className="font-display text-xl text-deep">Lune Privé</span>
    </div>

    {/* Search */}
    <div className="flex-1 max-w-2xl mx-12">
      <SearchBar />
    </div>

    {/* User Menu */}
    <div className="flex items-center gap-4">
      <button className="text-deep font-medium hover:bg-gray-50 px-3 py-2 rounded-lg">
        Become a Host
      </button>
      <UserMenu />
    </div>
  </div>
</header>
```

### 5. Modal/Dialog

**Airbnb Pattern** (Large rounded, centered)
```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
  <div className="relative w-full max-w-2xl bg-white rounded-airbnb-xl shadow-airbnb-xl overflow-hidden animate-fade-in-up">
    {/* Close Button */}
    <button className="absolute top-4 left-4 w-8 h-8 rounded-full hover:bg-gray-100 transition-colors">
      <X />
    </button>

    {/* Content */}
    <div className="p-8">
      <h2 className="text-2xl font-semibold text-deep mb-4">Modal Title</h2>
      <div className="space-y-4">
        {/* Content */}
      </div>
    </div>

    {/* Footer */}
    <div className="border-t border-gray-200 p-6 flex items-center justify-between">
      <button className="text-deep underline">Cancel</button>
      <button className="btn-airbnb btn-airbnb-primary">Confirm</button>
    </div>
  </div>
</div>
```

---

## 🎬 Animation & Interaction

### Timing Functions (Airbnb Standard)
```css
/* Natural easing */
cubic-bezier(0.4, 0, 0.2, 1)

/* Fast: 200ms */
--duration-fast: 200ms

/* Base: 300ms */
--duration-base: 300ms

/* Slow: 400ms */
--duration-slow: 400ms
```

### Common Patterns

**1. Card Hover** (Lift + Shadow)
```css
.hover-lift {
  transition: transform 200ms ease, box-shadow 200ms ease;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 28px rgba(0,0,0,0.16);
}
```

**2. Image Scale** (On card hover)
```css
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
  transition: transform 400ms ease;
}
```

**3. Fade In Up** (Content loading)
```css
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 300ms ease-out;
}
```

**4. Heart Bounce** (Favorite action)
```css
@keyframes bounce-heart {
  0%, 100% { transform: scale(1); }
  25% { transform: scale(1.3); }
  50% { transform: scale(0.9); }
  75% { transform: scale(1.1); }
}

.animate-bounce-heart {
  animation: bounce-heart 400ms ease-out;
}
```

---

## 📱 Responsive Design

### Breakpoints (Tailwind + Airbnb)
```css
sm: 640px    /* Mobile landscape */
md: 768px    /* Tablet */
lg: 1024px   /* Desktop */
xl: 1280px   /* Large desktop */
2xl: 1536px  /* Ultra-wide */
```

### Layout Patterns

**Grid System** (Airbnb Listings)
```tsx
{/* Mobile: 1 col, Tablet: 2 cols, Desktop: 3-4 cols */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {listings.map(listing => <ListingCard {...listing} />)}
</div>
```

**Container** (Max-width)
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>
```

---

## 🛡️ Accessibility Standards

### Airbnb Compliance (WCAG 2.1 AA)

1. **Color Contrast**
   - Text: 4.5:1 minimum
   - Large text: 3:1 minimum
   - Interactive elements: 3:1 minimum

2. **Keyboard Navigation**
   - All interactive elements focusable
   - Visible focus indicators
   - Logical tab order

3. **Screen Reader Support**
   - Semantic HTML
   - ARIA labels for icons/actions
   - Alt text for images

4. **Interactive States**
   ```tsx
   <button
     className="..."
     aria-label="Add to favorites"
     role="button"
     tabIndex={0}
   >
     <HeartIcon aria-hidden="true" />
   </button>
   ```

---

## 🚀 Implementation Strategy for Lune Privé

### Phase 1: Core Components (Week 1-2)
- [ ] Profile/Cast cards with Airbnb styling
- [ ] Search/filter interface
- [ ] Navigation header
- [ ] Primary buttons & forms

### Phase 2: Interactions (Week 3-4)
- [ ] Matching interface with animations
- [ ] Modal dialogs for booking/messaging
- [ ] Hover states & transitions
- [ ] Loading states with shimmer

### Phase 3: Luxury Enhancements (Week 5-6)
- [ ] Premium member badges
- [ ] Exclusive feature indicators
- [ ] Privacy level visualizations
- [ ] Trust & safety elements

### Phase 4: Polish (Week 7-8)
- [ ] Microinteractions
- [ ] Advanced animations
- [ ] Responsive refinements
- [ ] Performance optimization

---

## 📦 Next.js + Tailwind Implementation

### Component Structure
```
components/
├── ui/              # Base Airbnb components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   └── Modal.tsx
├── cast/            # Cast-specific
│   ├── CastCard.tsx
│   ├── CastProfile.tsx
│   └── CastSearch.tsx
└── member/          # Member-specific
    ├── MemberCard.tsx
    └── MemberDashboard.tsx
```

### Tailwind Config Integration
```typescript
// Already implemented in globals.css
// Use utility classes:
className="rounded-airbnb-md shadow-airbnb-hover hover-lift"
```

---

## 🎯 Key Takeaways

### What Makes Airbnb's Design System Great:
1. **12px minimum border-radius** - Signature rounded aesthetic
2. **20:19 image aspect ratio** - Unique card proportions
3. **Subtle shadows** - Depth without heaviness
4. **200-400ms animations** - Snappy but smooth
5. **Modular components** - Consistency at scale

### Lune Privé Differentiators:
1. **Luxury layering** - Gold/champagne accents
2. **Privacy-first** - Discreet indicators
3. **Exclusivity** - Premium member highlights
4. **Trust signals** - Verification badges

---

## 📚 Resources

- **Figma Kit**: [Airbnb Design System Summer 2025](https://www.figma.com/community/file/1508075888287458165)
- **React Components**: Tailwind CSS + Airbnb patterns
- **Style Guide**: GitHub - airbnb/javascript
- **Design Blog**: airbnb.design (archived content)

---

**Last Updated**: November 2025
**Version**: 1.0 - Initial Implementation
**Next Review**: After Phase 1 completion
