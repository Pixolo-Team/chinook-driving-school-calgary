# React Coding Instructions

This file defines **mandatory coding standards and AI behavior rules** for React files in the project.

All contributors (**human or AI**) must follow these rules strictly.

---

## Project Context

- Framework: **Next.js**
- Deployment: **Vercel**
- API Architecture: **REST APIs only**
- HTTP Client: **Axios (strictly enforced)**

---

## Rule 1 – No Direct Supabase Usage

The frontend must **never interact with Supabase directly**.

- All data must come from **REST API endpoints only**
- Supabase logic belongs to the backend only

---

## Rule 2 – Axios Only (No Fetch / XHR)

Only **Axios** is allowed for HTTP calls.

Do **NOT** use:

- `fetch`
- `XMLHttpRequest`
- any other HTTP client

### Standard Axios Pattern (MANDATORY)

```ts
// Prepare the API Call
const config: AxiosRequestConfig = {
  method: "get",
  url: `${CONSTANTS.API_URL}get-players-for-attendance.php?date=${date}&team=${batch}`,
  headers: { "Content-Type": "application/json" },
};

// Make the API Call and return Data
const response = await axios.request<ApiResponseData<AttendanceData>>(config);
return response.data;
```

---

## Rule 3 – Import Structure (MANDATORY)

All imports must be grouped with comments in the following order:

```ts
// REACT //
// TYPES //
// SERVICES //
// HOOKS //
// LIBRARIES //
// COMPONENTS //
// UTILS //
// MODULES //
```

Rules:

- React imports must always be **first**
- Order of other groups is flexible
- Segregation is mandatory

---

## Rule 4 – Function Naming Rules

- Must start with a **verb**
- Must use **camelCase**

Examples:

- `getUserDetails`
- `parseUserName`
- `findAttendance`

---

## Rule 5 – API Function Naming

All functions that perform API calls must end with `Request`.

Examples:

- `getUserDetailsRequest`
- `createAttendanceRequest`

---

## Rule 6 – TypeScript Rules (STRICT)

- All arguments must have types
- All functions must define return types
- All states must be typed

Example:

```ts
const [isUserReady, setIsUserReady] = useState<boolean>(false);
```

---

## Rule 7 – Variable Naming Rules

- Use **camelCase**
- Must be descriptive
- Avoid vague names such as `data` or `loading`

Correct examples:

- `isUserProfileLoading`
- `userProfileInfo`

---

## Rule 8 – Forbidden Naming

Variable names must **NOT** end with `Data`.

The `Data` suffix is reserved exclusively for **type and interface names** (e.g., `UserProfileData`, `AttendanceRecordData`).

---

## Rule 9 – Iteration Naming

When using loops or `.map()`, iteration variables must end with `Item`.

Example:

```ts
attendanceDetails.map((attendanceDetailItem) => {});
```

---

## Rule 10 – Type Naming Rules

- Use **PascalCase**
- Must end with `Data`

Examples:

- `UserProfileData`
- `AttendanceRecordData`

---

## Rule 11 – Comments Rules

- Comments must start with a **capital letter**
- Project entities must be capitalized (e.g. User, Attendance, Coach)
- Add spacing before comments for readability

---

## Rule 12 – JSDoc Rules (MANDATORY)

Every exported function must have a JSDoc comment.

```ts
/**
 * Fetches user profile details from API
 */
```

Rules:

- No `@param`
- No `@return`
- Description only

---

## Rule 13 – Inline Code Comments (MANDATORY)

Use inline comments to explain logic.

Example:

```ts
// Validate User input before API call
```

---

## Rule 14 – React Component Structure (MANDATORY)

Every React component must follow this structure order with required section comments:

```ts
// Define Navigation
// Define Context
// Define Refs
// Define States
// Helper Functions
// Use Effects
```

Example:

```tsx
/** User Profile Page */
export default function UserProfile() {
  // Define Navigation
  const router = useRouter();

  // Define Context

  // Define Refs
  const hasFetchedRef = useRef<boolean>(false);

  // Define States
  const [isUserProfileLoading, setIsUserProfileLoading] =
    useState<boolean>(true);
  const [userProfileInfo, setUserProfileInfo] =
    useState<UserProfileData | null>(null);

  // Helper Functions
  /**
   * Fetches user profile from API
   */
  const fetchUserProfile = async (): Promise<void> => {
    const { data, error } = await getUserProfileRequest();

    if (error) {
      setIsUserProfileLoading(false);
      return;
    }

    setUserProfileInfo(data ?? null);
    setIsUserProfileLoading(false);
  };

  // Use Effects
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchUserProfile();
  }, []);

  return <div>User Profile</div>;
}
```

---

## Rule 15 – File Naming Rules

- Use **kebab-case** for services, utils, styles, and types

  Examples: `user-profile.type.ts`, `string-parser.util.ts`

- Use **PascalCase** for React component files

---

## Rule 16 – General Code Quality Rules

- Keep functions small
- Avoid nested logic
- Prefer readability over clever code
- Remove unused variables
- Do not introduce new patterns

---

## Rule 17 – Modular Context Files

Additional `.md` files may be added inside `.github/` to provide domain knowledge, user flows, and business rules.

Examples:

```
.github/
├── copilot-instructions.md
├── user-flow.md
├── attendance-rules.md
├── coach-management.md
```

Rules:

- Always read `copilot-instructions.md` first
- Refer to other `.md` files for additional context
- Additional files must **not** override core rules
- Use them to improve accuracy of implementation

---

## Final Rule

If code does not follow these rules, it is **incorrect even if it works**.
