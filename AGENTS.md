# Astro App – Copilot Instructions & Coding Standards

This document defines **mandatory coding rules** for all Astro repositories.

All contributors (**human or AI**) must follow these rules strictly.

This repository is built for **production-grade applications**.  
Code quality, consistency, and clarity are **non-negotiable**.

These rules ensure:

predictable architecture  
consistent naming  
maintainable services  
scalable frontend code  
AI-generated code that matches repository standards

If generated code violates these rules, **it must be considered incorrect even if it works**.

---

# 1. Import Rules (MANDATORY)

Always use the **project alias @/** for imports.

Relative imports introduce fragile dependencies and must never be used.

### ✅ Correct

ts
import { getTournamentsRequest } from "@/services/tournament.service";
import { formatCurrencyService } from "@/services/format-currency.service";
import Hero from "@/components/Hero.astro";

### ❌ Incorrect

ts
import { getTournaments } from "../../services/tournament.service";
import Hero from "../../../components/Hero.astro";

---

# 2. File Naming Rules

All file names must follow **kebab-case**.

File names must clearly describe their responsibility.

### ✅ Correct

tournament.service.ts
football-tournaments.request.ts
organizer-profile.component.ts
tournament-card.astro

### ❌ Incorrect

TournamentService.ts
GetTournaments.ts
OrganizerProfile.ts

### Special Rule

Only **UI component files (.astro)** may use **PascalCase**.

All other files must use **kebab-case**.

---

# 3. Function Naming Rules

All function names must:

start with a **verb**
use **camelCase**
clearly describe the action

### ✅ Correct

getTournamentsRequest()
createTournamentService()
formatPrizeData()

### ❌ Incorrect

tournaments()
TournamentCreate()
dataFormatter()

---

# 4. API Request Functions

Any function that performs an **API / HTTP / database call** must end with **Request**.

This applies to:

REST APIs  
GraphQL calls  
Supabase queries  
external APIs  
internal backend calls

### ✅ Correct

getTournamentsRequest()
createTournamentLeadRequest()
getTournamentDetailsRequest()

### ❌ Incorrect

fetchTournaments()
loadTournamentData()
getTournament()

---

# 5. Service Layer Rules

All **business logic must live inside service files**.

Service functions must end with **Service**.

Services must **never directly interact with UI components**.

### ✅ Correct

createTournamentService()
mapTournamentListingService()
validateOrganizerService()

### ❌ Incorrect

createTournament()
tournamentMapper()
validateOrganizer()

---

# 6. Data Type Naming Rules (STRICT)

ALL data structures must end with **Data**.

Applies to:

interfaces  
types  
DTOs  
API responses  
domain models

### ✅ Correct

ts
interface TournamentData {}
interface TournamentListingItemData {}
type OrganizerProfileData = {}

### ❌ Incorrect

ts
interface Tournament {}
interface OrganizerProfile {}
type TournamentItem = {}

---

# 7. JSDoc Comments (MANDATORY)

Every exported function **must include a JSDoc comment**.

Minimum requirement: **one-line explanation**.

### ✅ Correct

ts
/\*\*

- Fetches published tournaments with filters applied
  \*/
  export async function getTournamentsRequest() {}

### ❌ Incorrect

ts
export async function getTournamentsRequest() {}

---

# 8. Commenting Rules

Comments must explain **WHY**, not **WHAT**.

Use comments for:

complex logic  
business rules  
integrations  
edge cases

### ✅ Good

ts
// External ref ID ensures idempotent imports from Google Sheets

### ❌ Bad

ts
// increment i
i++

---

# 9. Console Logs (STRICT)

Console statements must **never exist in committed code**.

Forbidden:

console.log
console.error
console.warn
console.debug

Allowed only during **local debugging**.

All console logs must be **removed before commit**.

---

# 10. Error Handling Rules

Errors must **always be handled explicitly**.

Never swallow errors silently.

Errors must return a **predictable structure**.

### ✅ Correct

ts
return { data: null, error }

or

ts
throw new Error("Failed to fetch tournaments")

### ❌ Incorrect

ts
catch (e) {
return null;
}

---

# 11. Global Variables & Constants Rule

Global variables and constants must always be used instead of hardcoding values.

Reusable values must be defined in global files such as:

src/constants
src/config
src/globals

Examples include:

pagination sizes  
API URLs  
default filters  
environment configuration  
reusable limits

### ✅ Correct

ts
const PAGE_SIZE = DEFAULT_PAGE_SIZE

### ❌ Incorrect

ts
const PAGE_SIZE = 10

Hardcoding repeated values inside components or services is **not allowed**.

---

# 12. General Code Quality Rules

Code must prioritize:

clarity  
maintainability  
predictability

Guidelines:

keep functions small  
avoid deeply nested logic  
prefer readability over clever code  
remove unused variables  
avoid premature optimization

---

# 13. Astro Image Component Rule

Images must use **Astro's Image component from astro:assets**.

### Import

ts
import { Image } from "astro:assets";

### Correct

astro
<Image
  src="/images/tournament-banner.jpg"
  alt="Tournament banner"
  width={800}
  height={400}
/>

### Incorrect

html
<img src="/images/tournament-banner.jpg" />

The Astro Image component provides:

automatic image optimization  
responsive images  
lazy loading  
improved performance

---

# 14. Icon Component Rule

Icons must be rendered using the **astro-icon component**.

All icons must be stored locally inside the project at:

src/icons

### Import

ts
import { Icon } from "astro-icon/components";

### Correct Usage

astro
<Icon name="football" />

The name property must match the **SVG filename** located inside the src/icons directory.

### Example Icon Structure

src/icons
├ football.svg
├ trophy.svg
├ search.svg

### Rules

Icon names must match the SVG file name.
All icons must be stored inside src/icons.
Do not embed raw SVG code directly inside pages or components.
Do not reference external icon libraries.

Using the shared icon component ensures:

consistent icon rendering across the project
centralized icon management
cleaner component code
easier icon updates and maintenance

# 15. Astro Hydration Rules

Astro components must remain **server-rendered by default**.

Client-side hydration must only be used when necessary.

Astro hydration directives include:

client:load
client:visible
client:idle
client:only

### Correct

Use hydration only for **interactive components**.

Example:

astro
<SearchBar client:load />

### Incorrect

Adding hydration to **all components unnecessarily**.

---

# 16. Server Data Fetching Rules

Astro data fetching should occur in **component frontmatter**.

Example:

## astro

import { getTournamentsRequest } from "@/services/tournament.service";

## const { data } = await getTournamentsRequest();

This ensures data fetching happens **server-side by default**.

---

# 17. AI (Copilot) Generation Rules

When generating code, AI tools must:

follow all naming conventions  
match existing project patterns  
use service + request architecture

AI must **never introduce**:

unused variables  
commented-out code  
console logs  
inconsistent naming  
new architectural patterns

If unclear, AI must **ask for clarification instead of guessing**.

---

# Final Rule (Non-Negotiable)

If code does not follow these rules, it is **incorrect even if it works**.

These standards ensure:

predictable architecture  
scalable services  
consistent naming  
production-grade reliability

All contributors must follow these rules **without exception**.
