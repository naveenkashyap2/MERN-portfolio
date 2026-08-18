# Product Requirements (summary)

YatraGenie AI — "India's AI Travel & Trip Planning Assistant". Budget bolo → YatraGenie tumhare
liye complete trip plan kare.

## Vision
A premium, production-style AI Travel Operating System for India — combining AI planning, budget
intelligence, itinerary, hotels, places, temples & gurudwaras, transport, walking routes, live
location, arrival detection, expenses, and an AI assistant with dynamic replanning.

## Core user flow
Signup/Login → Create trip → origin/destination/dates/travelers/budget → transport → hotel →
interests → Generate → AI planning → itinerary/transport/hotels/places/routes → live location →
arrival detection → expenses → AI assistant → dynamic replanning → trip complete.

## Design language
Dark premium interface (`#0B1120` base) with light travel imagery, Inter/Poppins typography,
subtle gradients (hero/CTA/AI only), glassmorphism used selectively, Framer Motion animations that
respect `prefers-reduced-motion`, and full mobile/tablet/desktop responsiveness.

## Guiding rules
- One primary CTA per section; progressive disclosure; important info first.
- Never surprise users with location tracking (consent-first).
- Never fake live data — label VERIFIED vs AI RECOMMENDED vs ESTIMATE.
- Never expose secrets; never trust client-supplied identity; never store raw AI output.

## Success criteria
A user can register, plan a local or intercity trip from a sentence or a form, get an AI itinerary,
edit/optimize/replan it, search places/transport/hotels, use walking + live tracking with arrival
detection, track expenses, chat with the AI, save favorites, share securely, manage privacy and
delete their account — with no secret exposure, no unauthorized access and no fake live data.
