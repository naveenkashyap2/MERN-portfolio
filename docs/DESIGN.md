# YatraGenie AI — Frontend Design + UI/UX Master PRD

**Status:** LOCKED  
**Product:** YatraGenie AI  
**Tagline:** India's AI Travel & Trip Planning Assistant  

This is the single source of truth for visual design, UX, microcopy, and screen purpose.

**Implementation tree:** [`FRONTEND.md`](./FRONTEND.md)  
**Backend APIs:** [`API.md`](./API.md)  
**Tokens:** [`DESIGN_TOKENS.json`](./DESIGN_TOKENS.json)

---

## Stack (locked)

- React.js · Vite · JavaScript only (**no TypeScript**)
- Tailwind CSS · Framer Motion · React Router
- Axios · TanStack React Query · Lucide React · Recharts

**Hard rules**

- Premium production-grade UI
- Mobile + tablet + desktop
- Accessibility-first
- Performance optimized
- Reusable component architecture
- No unnecessary clutter
- No fake live-data indicators
- Never expose API keys
- Frontend talks to backend `/api/v1` only
- Never call Gemini from the client

---

## 1. Design vision

YatraGenie should feel like:

**AI Assistant + Google Maps travel + premium travel SaaS + modern fintech dashboard**

Must **not** look like:

- Basic college project
- Generic CRUD dashboard
- Plain AI chatbot
- Basic travel website

It should feel like a real startup product.

Keywords: Premium · Modern · Intelligent · Travel-focused · Minimal · Trustworthy · Fast · Interactive · Cinematic · Professional · Clean

---

## 2. Primary UX principle

> Tell YatraGenie where you want to go, your budget, your preferences, and let AI plan the journey.

| Role | Label |
|------|--------|
| Primary CTA | **Plan My Trip** |
| Secondary CTA | **Explore India** |

---

## 3. Design language

Dark premium interface with light travel imagery.

| Token | Value | Use |
|-------|--------|-----|
| `bg.primary` | `#0B1120` | App background |
| `bg.secondary` | `#111827` | Secondary surfaces |
| `bg.card` | `#172033` | Cards |
| `bg.elevated` | `#1E293B` | Elevated cards |
| `accent.primary` | `#3B82F6` | Primary accent |
| `accent.secondary` | `#06B6D4` | AI / cyan |
| `status.success` | `#22C55E` | Success |
| `status.warning` | `#F59E0B` | Warning |
| `status.danger` | `#EF4444` | Danger |
| `text.primary` | `#F8FAFC` | Body / headings |
| `text.secondary` | `#94A3B8` | Muted |
| `border.subtle` | `rgba(255,255,255,0.08)` | Borders |

**Do not overuse gradients.** Gradients only for:

- Hero
- Important CTA
- AI elements
- Active states
- Premium highlights

---

## 4. Typography

Primary font: **Poppins** (fallback Inter).

| Role | Weight | Size |
|------|--------|------|
| Hero heading | Bold / SemiBold | 56 desktop / 40 tablet / 32 mobile |
| Page heading | Bold / SemiBold | 36 desktop / 28 mobile |
| Body | Regular | 16 |
| Small | Regular | 13–14 |
| Numbers | Medium / Semibold | inherit |

---

## 5. Spacing system

Use only: `4 8 12 16 20 24 32 40 48 64 80 96`  
No random margins.

---

## 6. Border radius

| Token | Value |
|-------|--------|
| Small | 8px |
| Medium | 12px |
| Large | 16px |
| Premium cards | 20px |
| Hero elements | 24px |
| Buttons | 12px |

---

## 7. Shadow system

Subtle only. Cards: floating, soft, premium. **No heavy shadows.**

---

## 8. Glassmorphism

Use selectively. Not on every component.

```
background: rgba(255,255,255,0.05)
backdrop-blur: 16px
border: 1px solid rgba(255,255,255,0.08)
```

---

## 9. Icon system

**Lucide React only.** No random icon libraries.

MapPin · Navigation · Train · Bus · Hotel · Wallet · Calendar · Clock · Sparkles · Bot · Compass · Heart · Star · Route · Footprints · Temple · Shield · Bell · Settings · User · Menu · Search · ArrowRight · ChevronRight

---

## 10. Global navbar

**Desktop**

- Logo: YatraGenie AI
- Nav: Home · Explore · Plan Trip · My Trips · AI Assistant
- Right: Notifications · Profile
- Primary CTA: Plan Trip
- Sticky, `top: 0`, high z-index
- Backdrop blur on scroll

**Mobile**

- Logo + menu
- Menu: Home · Explore · Plan Trip · My Trips · AI Assistant · Favorites · Profile · Settings · Logout

---

## 11. Landing page — `/`

Sections in order:

1. Navbar  
2. Hero  
3. AI Trip Planner  
4. How It Works  
5. Feature Showcase  
6. Live Trip Preview  
7. AI Assistant  
8. Budget Intelligence  
9. Hotels  
10. Spiritual Travel  
11. Local Travel  
12. Popular Destinations  
13. Testimonials  
14. FAQ  
15. CTA  
16. Footer  

**Feel:** cinematic + premium. Do not make it look like a dashboard.

---

## 12–13. Hero

**Headline:** `Your Journey. Planned by AI.`  
**Alt:** `Tell us where. We'll plan the journey.`

**Subtitle:** Create intelligent India trips with AI-powered itineraries, routes, stays, budgets and real-time trip assistance.

- Primary: Plan My Trip  
- Secondary: Explore Destinations  
- Visual: large interactive map-style panel — Delhi → Agra → Jaipur with animated route  
- Floating cards: ₹5,000 Budget · 2 Days · AI Optimized  
- Do **not** overcrowd  

**Micro-interactions (Framer Motion)**

- Plan My Trip lifts on hover  
- Map route animates  
- AI badge pulses subtly  
- Smooth only — no excessive bounce  

---

## 14. AI planner demo (landing)

Large premium card. Heading: **Plan your next journey**

Fields: From · To · Dates · Travelers · Budget  

Quick prefs: Train · Bus · Car · Walking  
Hotel: Budget · Medium · Premium  
Interests: Temple · Gurudwara · Nature · Food · Adventure · History  
CTA: **Generate My Trip ✨**

---

## 15. Natural language input (signature UX)

Label: `Or just tell YatraGenie what you want...`  
Input: `Delhi se Agra 2 din ke liye jana hai...`  
Button: **Plan with AI**

---

## 16. Plan trip page — `/plan`

Progress: `01 Destination → 02 Preferences → 03 Budget → 04 Transport → 05 Stay → 06 Generate`

- Desktop: 60/40 — form left, live trip summary right  
- Mobile: single column  
- Feel: focused + simple  

---

## 17. Step 1 — Destination

From / To · search + autocomplete · map preview  
Buttons: Use Current Location · Swap Locations  
Example: Delhi ↕ Agra

---

## 18. Current location UX

Button: **Use my location**

States: Locating... · Location detected · Permission denied · Location unavailable  

**Never silently enable tracking.**

---

## 19. Step 2 — Dates

Premium calendar. Start + end. Show duration (`2 Days / 1 Night`). Disable invalid dates.

---

## 20. Step 3 — Travelers

Adults / Children counters (`-` / `+`). Show `2 Travelers`. No negatives.

---

## 21. Step 4 — Budget

Slider: ₹1,000 · ₹5,000 · ₹10,000 · ₹25,000 · ₹50,000+  
Custom input allowed.  
Level labels: Budget · Comfort · Premium

---

## 22. Step 5 — Transport

Cards: Train · Bus · Car · Walking · Any  

Example: Train — “Fast & economical”  

Active: blue border + subtle glow + check icon

---

## 23. Step 6 — Hotel

- Budget — ₹ Affordable stays  
- Medium — ₹₹ Comfort stays  
- Premium — ₹₹₹ Premium stays  
- Optional: No hotel needed  

---

## 24. Step 7 — Interests

Multi-select chips: Temple · Gurudwara · Historical · Nature · Adventure · Food · Shopping · Photography · Family · Spiritual  

Show selected count.

---

## 25. Generation screen

On **Generate My Trip** → cinematic AI generation.

Copy: `YatraGenie is building your journey...`

Steps (do **not** fake real-time provider checks):

- Understanding your preferences  
- Optimizing your route  
- Finding places  
- Planning your itinerary  
- Calculating your budget  
- Preparing your trip  

AI-generated content must be labeled **AI-generated**.

---

## 26–28. Trip dashboard — `/trips/:tripId`

**Feel:** information-rich + organized  

Desktop: left sidebar · main · right contextual panel  
Mobile: bottom navigation  

**Header:** Delhi → Agra · 2 Days • 1 Night · ₹5,000 Budget · 2 Travelers  
Buttons: Start Trip · Edit · Share · More  

**Hero card:** destination image overlay — Agra · 2 Days · AI Optimized · Budget ₹5,000 · CTA Start Journey

---

## 29–31. Itinerary

Vertical timeline. Each item: time · place · duration · distance · cost · transport.

**Card:** image · name · category · time · duration · distance  
Actions: Navigate · Edit · Remove · AI Optimize  
Hover: slight rise  

Drag & drop reorder → toast: `Your route has been updated.`  
Optional: Optimize Route

---

## 32. Map panel

Major part of trip dashboard.

Show: current location · origin · destination · itinerary stops · route · walking path · transport path  

Distinct treatment: Walking · Bus · Train · Driving  
Support: zoom · pan · fit route  

Animate: route drawing · current marker · progress · destination pulse  
**Do not constantly animate all markers.**

---

## 33–34. Live trip mode — `/trips/:tripId/live`

**Feel:** map-first  

On Start Journey:

Header: `You're on your journey 🚀`  
Show: current location · next stop · distance · ETA · progress · map  

**Live location card**

```
📍 You are here — Connaught Place
Next: India Gate
Distance: 4.2 km
ETA: 52 min
Progress: 42%
[Stop Tracking]
```

---

## 35. Walking mode

Show: walking route · 10.2 km · 2h 05m · progress `4.2 / 10.2 km` · large progress ring  
Actions: Start Walking · Pause · Stop

---

## 36. Arrival UI

Full-screen success modal. ✓  
`You've arrived!`  
`Welcome to India Gate.`  
Buttons: Explore Place · Next Stop · Take a Break  
Subtle celebration. Respect reduced-motion.

---

## 37. Location permission modal

Never aggressively request permission.

`Turn on location to unlock Live Trip Mode.`

Benefits: Live distance · Walking progress · Arrival detection · Better route guidance  

Buttons: Enable Location · Maybe Later

---

## 38–39. Transport — `/transport`

**Feel:** data-first  

Tabs: Train · Bus · Local  
Search: From · To · Date  

Result card: name · number · departure · arrival · duration · fare · availability  

Trust labels (required):

| Label | When |
|-------|------|
| **LIVE VERIFIED** | Verified provider only |
| **AI ESTIMATE** | AI / estimated |
| **CACHED** | Stale cache — never shown as live |

**Never use “Live” without a verified live source.**

Comparison cards: Fastest · Cheapest · Most Comfortable · AI Recommended  

Example: Train 4h 30m ₹900 · Bus 6h 10m ₹650 · Car 5h ₹1800

---

## 40–41. Hotels — `/hotels`

**Feel:** comparison-first  

Search · filters · sort  
Filters: Budget · Medium · Premium · Rating · Distance · Amenities  

Card: image · name · rating · price · distance · amenities  
Buttons: View · Save · Add to Trip  

Three tabs: Budget · Medium · Premium — distinct hierarchy, not too many colors.

---

## 42–43. Explore — `/explore`

**Feel:** visual discovery-first  

Search: `What are you looking for?`  
Categories: Nearby · Popular · Temple · Gurudwara · Historical · Nature · Food · Shopping · Adventure  

Grid: 4 desktop / 2–3 tablet / 1–2 mobile  

**Place card:** image · name · category · rating · distance · Open/Closed **only when verified**  
View Details · Navigate · Favorite heart

---

## 44. Spiritual travel

Section: `Discover India's spiritual side`  
Cards: Temples · Gurudwaras · Historic Shrines · Spiritual Experiences  
CTA: **Build Spiritual Trip**

---

## 45. Nearby — `/nearby`

Header: `What's around you?`  
Map on top. Nearby cards below.  
Radius: 500m · 1km · 5km · 10km  
Categories: Food · Temple · Gurudwara · Hotel · Park · Historical

---

## 46–49. AI assistant — `/assistant`

**Feel:** conversation-first  

Desktop: conversation sidebar · chat · context panel  
Header: `YatraGenie AI ✨`  
Subtitle: Your personal travel assistant  

User messages right · AI left  
AI cards may embed: place · hotel · route · itinerary · budget  

**Quick actions (above input):** Optimize Trip · Reduce Cost · Find Nearby · Change Hotel · Add Temple · Add Gurudwara · I'm Late · Replan  

Input: `Ask YatraGenie anything...`  
Attach · optional voice · Send (disabled when empty)  
Loading: `AI is thinking...`

AI visual language: Sparkles · cyan/blue glow · gradient border · soft animation · badge `✨ AI Optimized`  
AI-generated information must be visually identifiable.

---

## 50. “I'm Late” UX

Prominent quick action → modal: `What's happening?`

Options: I'm running late · I missed my transport · I want fewer places · I need a cheaper plan · I want to skip this stop  

AI generates a revised itinerary.

---

## 51–53. Budget — `/trips/:tripId/budget`

**Feel:** analytics-first  

Total · Spent · Remaining  
Recharts: Transport · Hotel · Food · Activities · Other  

Warning near cap: `You're close to your budget.` e.g. ₹4,500 / ₹5,000 · **Optimize Budget**

**Add expense modal:** Amount · Category · Description · Date  
Categories: Transport · Hotel · Food · Shopping · Activities · Other  
CTA: Add Expense

---

## 54–55. My trips — `/trips`

Tabs: Upcoming · Active · Completed  
Card: destination · dates · budget · travelers · progress  
Actions: View · Edit · Share · Duplicate · Delete  

Empty: minimal travel illustration  
`Your next adventure starts here.`  
CTA: **Create AI Trip**

---

## 56. Favorites — `/favorites`

Tabs: Places · Hotels · Trips · Heart animation on favorite.

---

## 57. Notifications

Drawer. Types: Trip reminder · Arrival · Budget alert · Transport update · AI recommendation  
Unread indicator · Mark all as read

---

## 58. Profile — `/profile`

**Feel:** settings-first (with identity header)

Avatar · name · email  
Stats: Trips · Places · Cities · Money saved  
Sections: Travel preferences · Favorite transport · Budget style

---

## 59–61. Settings — `/settings`

Tabs: Account · Security · Privacy · Location · Notifications · AI Preferences

**Security:** Password · Google account · Active sessions · Logout all devices · status **Protected**

**Location:** permission · Tracking ON/OFF · History ON/OFF · **Delete Location History** + clear explanation

---

## 62. Share trip

Modal: `Share your journey`  
Copy Link · QR · WhatsApp · Email  
Permission: View only  
Never expose private information. Share via random token (see API contract).

---

## 63. Search UX

Global search: Places · Hotels · Trips · Destinations  
Debounced suggestions  
Keyboard: `/` opens search

---

## 64. Toast system

**Never use `alert()`.**

| Type | Example |
|------|---------|
| Success | Trip updated successfully. |
| Error | Something went wrong. |
| Warning | Location permission is required. |
| Info | AI is optimizing your route. |

---

## 65–66. Modals & drawers

**Modals:** Confirmation · Information · Form · AI · Location · Delete · Share  
Animation: fade + scale · blur backdrop  

**Drawers:** Filters · Mobile menu · Notifications · Trip actions

---

## 67. Skeleton loading

Every major page needs skeletons: hotel · trip · place · AI · map  
**Never show a blank screen.**

---

## 68. Error states

Friendly only. Example: `YatraGenie couldn't load this right now.`  
Try Again · Go Back  

Never expose: 500 · MongoDB · stack traces · Gemini errors

Auth example: never `MongoDB duplicate key error` → `An account with this email already exists.`

---

## 69. Offline UI

Top banner: `You're offline`  
Cached trip remains available.  
Live features disabled with explanation.  
Never treat stale live transport as current.

---

## 70. Responsive

| Breakpoint | Range |
|------------|--------|
| Mobile | 320–767 |
| Tablet | 768–1023 |
| Desktop | 1024+ |
| Large | 1440+ |

Every component adapts. **No horizontal overflow.**

---

## 71. Mobile bottom navigation

Home · Explore · Trips · AI · Profile  
Active: accent + small indicator

---

## 72. Mobile trip experience

Top: destination → map → next stop → timeline → budget → AI  
Sticky: **Start Journey**

---

## 73. Mobile live mode

Map = upper 50%. Bottom sheet: current · next · distance · ETA. Bottom: Stop Tracking.

---

## 74. Accessibility

Keyboard · screen readers · focus management · ARIA · semantic buttons · accessible forms · reduced motion  
Do not rely on color alone.

---

## 75–76. Motion

Framer Motion: fade · slide · scale · hover · page transition · card entrance · modal · route  

Durations: **150 / 200 / 300 / 500 ms** only.  
Avoid longer animations.  
Respect `prefers-reduced-motion`.  

Page transitions: fade + slight vertical movement. No flashy transitions.

---

## 79–80. Data trust UX (non-negotiable)

Every data card must distinguish:

| Badge | Meaning |
|-------|---------|
| LIVE VERIFIED | Verified provider |
| AI RECOMMENDED / AI ESTIMATE | Model output |
| ESTIMATED | Heuristic |
| CACHED | Not current |

Never make AI look like verified real-time data.

Also show: transport provider · hotel provider · GPS accuracy (e.g. ±12m)

---

## 81. Delete confirmation

Dangerous actions need confirm.  
`Delete this trip?` → Cancel · Delete Trip  
Account deletion: extra confirmation.

---

## 82. Reusable components (must exist)

Button · Input · Select · DatePicker · Modal · Drawer · Toast · Tooltip · Badge · Card · Avatar · Dropdown · Tabs · Progress · Skeleton · EmptyState · ErrorState · MapContainer · PlaceCard · HotelCard · TransportCard · TripCard · ItineraryCard · ExpenseCard · AIMessage · AIAction · LocationCard · BudgetCard

---

## 83. Layout components

AppLayout · AuthLayout · DashboardLayout · TripLayout · AdminLayout · MobileLayout

File names follow [`FRONTEND.md`](./FRONTEND.md). Extra layouts from this list are additive when needed.

---

## 85. Routes

**Public**

- `/`
- `/explore`
- `/login`
- `/register`
- `/forgot-password`

**Protected**

- `/plan`
- `/trips`
- `/trips/:tripId`
- `/trips/:tripId/live`
- `/trips/:tripId/budget`
- `/transport`
- `/hotels`
- `/nearby`
- `/assistant`
- `/favorites`
- `/profile`
- `/settings`

These UX routes are locked. Map them onto files in [`FRONTEND.md`](./FRONTEND.md) at implementation time (do not invent a second tree).

---

## 86–88. Auth UX

Login: Email · Password · Login · Continue with Google · Forgot Password · Register  
Premium visual: travel image / map background. Keep the form simple.

Register: Name · Email · Password · Confirm Password · Continue with Google · password strength indicator

Friendly auth errors only.

---

## 89. 404

Lost-traveler illustration.  
`Looks like you've taken a wrong turn.`  
Back to Home

---

## 90. Performance UX

Lazy routes · lazy images · skeletons · optimistic updates · debounced search · React Query cache · pagination · virtualize large lists

---

## 91. Frontend security

- Never store Gemini API key
- Prefer HttpOnly cookies over localStorage for auth tokens
- No passwords / secrets / private data in URLs
- Sanitize any rich content
- No unsanitized HTML rendering

---

## 92. Form UX

Every form: label · input · validation · error · loading · success  
Example error: `Enter a valid budget.`

---

## 93. Button states

Default · Hover · Active · Loading · Disabled · Success · Error (where needed)  
`Generate Trip` → `Planning...`

---

## 94. Dashboard sidebar (desktop)

Logo  
Home · Plan Trip · My Trips · Explore · Transport · Hotels · Nearby  
AI Assistant  
Favorites  
Bottom: Notifications · Settings · Profile  
Collapse option.

---

## 95. Dashboard home

Greeting: `Good evening, Naveen 👋`  
Main CTA: `Where are we going next?`  
Upcoming trip · recent trips · quick actions · AI recommendations · nearby · budget overview

---

## 96. Quick actions

Plan Trip · Explore Nearby · Find Hotels · Find Transport · Ask AI

---

## 97. Premium microcopy

| Avoid | Use |
|-------|-----|
| Submit | Plan My Trip |
| Loading | Planning your journey... |
| Error | We hit a small roadblock. |
| No data | Nothing here yet. |

---

## 98. UX rules

1. One primary CTA per section.  
2. Never overwhelm with forms.  
3. Progressive disclosure.  
4. Important information first.  
5. AI stays conversational.  
6. Always show current context.  
7. Always show loading.  
8. Always show error recovery.  
9. Never hide important permissions.  
10. Never surprise users with location tracking.

---

## 99. Visual hierarchy

1. Destination  
2. Current action  
3. Time  
4. Distance  
5. Budget  
6. Recommendations  
7. Secondary information  

---

## 100. Final UX journey

```
LANDING → Plan My Trip → Destination → Dates → Travelers → Budget
→ Transport → Hotel → Interests → Generate → AI Generation
→ Trip Dashboard → Itinerary → Map → Transport → Hotel → Budget
→ Start Journey → Enable Location → Live Tracking
→ Walking / Transport → Arrival → Next Stop
→ AI Assistant → Dynamic Replanning → Trip Complete
```

---

## 101. Quality bar (must have)

Premium landing · premium dashboard · modern navbar · responsive sidebar · mobile bottom nav · AI-first UX · interactive planner · itinerary timeline · interactive map · live trip · walking mode · arrival UI · hotel cards · transport cards · place explorer · temple/gurudwara discovery · budget dashboard · expense charts · AI assistant · AI quick actions · skeletons · empty states · error states · toasts · modals · drawers · responsive layouts · accessibility · Framer Motion · secure auth UX · privacy controls · location permission UX · data trust indicators

---

## 102. Absolute design rule

**Do not make every screen look like a dashboard.**

| Screen | Purpose |
|--------|---------|
| Landing | Cinematic + premium |
| Planner | Focused + simple |
| Trip dashboard | Information-rich + organized |
| Live mode | Map-first |
| AI assistant | Conversation-first |
| Explore | Visual discovery-first |
| Hotels | Comparison-first |
| Transport | Data-first |
| Budget | Analytics-first |
| Profile | Settings-first |

Every screen has one clear purpose.

---

## 103. Final product feel

When a user opens YatraGenie they should immediately feel:

> This is not a college project. It feels like a real travel startup.

Communicate: AI intelligence + travel expertise + trust + safety + modern design + personalization

```
PLAN → DISCOVER → OPTIMIZE → TRAVEL → TRACK → ARRIVE → REMEMBER
```

YatraGenie AI should make travel planning feel effortless.

**Do not implement a different visual system.** This file is the design contract.
