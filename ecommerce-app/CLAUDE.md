# CLAUDE.md — Interview Prep & Project Brain Dump

Everything you need to confidently explain this project (ShopZone — the Leegality Frontend
assessment). Read top-to-bottom once; skim the **Q&A** section before the call.

---

## 1. 30-second pitch

> "It's an Amazon-style product listing + detail app on the DummyJSON API. Products are fetched with
> Redux Toolkit thunks and then **filtered, sorted, and paginated client-side** using pure functions.
> All filter state is **mirrored in the URL**, so filters are shareable and survive refresh and Back
> navigation. I added cart, wishlist, checkout, search, and sort on top of the core requirements, and
> made it fully responsive with a persistent filter sidebar on desktop and a drawer on mobile."

---

## 2. Tech stack & why

| Choice | Why |
| --- | --- |
| **React 19 + Vite** | Fast dev/build; functional components + hooks. |
| **Redux Toolkit** | Filter state is shared across navbar, sidebar, listing, URL sync. RTK removes boilerplate (`createSlice`, `createAsyncThunk`). |
| **React Router 7** | Two routes + `/checkout`; `useSearchParams` for URL-synced filters. |
| **Tailwind CSS v4** | Fast styling, no context switching, responsive utilities. |
| **MUI (sparingly)** | Only icons + `Rating`, `Skeleton`, `Drawer`, `Pagination`. Be ready to justify (brief says "avoid heavy UI libraries"). |
| **Axios** | Small wrapper with a base URL instance. |

---

## 3. Folder architecture (feature-based)

```
api/         → axios instance + 5 endpoint functions
app/store.js → configureStore + localStorage persistence
features/    → products, cart, wishlist, ui (each a Redux slice)
hooks/       → useProducts, useFilterMeta, useQueryParams, useDebounce
utils/       → filterProducts (PURE filter/sort/brand), storage, constants
components/  → layout / filters / product / common
pages/       → ProductListingPage, ProductDetailPage, CheckoutPage
```

**Separation of concerns**: presentational components take props only; data-fetching + derivation
lives in hooks; business logic (filter/sort) lives in pure, testable functions in `utils/`.

---

## 4. Data flow (the important part)

1. **`useProducts()`** reads `filters.selectedCategory` and dispatches `fetchProducts(category)` in a
   `useEffect`. The thunk fetches products (`/products` or `/products/category/{c}`) **and** categories
   in one `Promise.all`, stores them in `productsSlice`.
2. The raw `allProducts` array is then run through **pure functions** (memoised):
   `filterProducts` → `sortProducts` → `paginateProducts`.
3. **`useQueryParams()`** does two things:
   - on mount: hydrate Redux filters **from** the URL query string;
   - on filter change: write Redux filters **back to** the URL (`?category=&minPrice=&brand=&q=&sort=&page=`).
4. Brand list comes from **`fetchAllBrands`** (dispatched once in `App.jsx`) — `/products?limit=0&select=brand`
   → `computeAvailableBrands` → deduped `[{brand, count}]`.

**Why client-side filtering?** The API can't combine price + brand + search + sort in one request.
Since the whole catalog is small (~194 items), fetching once and filtering in memory is instant and
lets every filter compose cleanly. Trade-off: wouldn't scale to millions of rows — then you'd push
filters server-side with `limit`/`skip`.

---

## 5. Every design decision (with the "why")

- **URL as source of truth for filters** → shareable links, Back preserves state, refresh-safe.
  This is how the brief's "filters remain applied when navigating back" is satisfied.
- **Page reset inside the reducer** → each filter action sets `currentPage = 1` in the *same*
  reducer, avoiding `useEffect` race conditions.
- **Debounced search + price** (`useDebounce`, 300 ms) → don't re-filter on every keystroke.
- **Brands from full catalog** (not current category) → filter is always complete.
- **cart/wishlist persistence** → `store.subscribe` writes to `localStorage`; `preloadedState`
  rehydrates on load. Guarded with try/catch (`utils/storage.js`) so private mode never crashes.
- **Lazy-loaded routes** (`React.lazy` + `Suspense`) → smaller initial bundle (3 page chunks).
- **Persistent sidebar on desktop, drawer on mobile** → matches the brief ("Left Side → Filters")
  while keeping a polished mobile UX. Shared body extracted into `FilterPanel`.
- **Scroll restore** → listing saves `window.scrollY` to `sessionStorage`; restores on remount after
  Back from detail.

---

## 6. Gotchas I hit (great "tell me about a bug" stories)

1. **Tailwind v4 layering vs. an un-layered reset.** A global `* { padding: 0 }` (written outside any
   `@layer`) silently overrode *every* Tailwind `px-*`/`py-*` utility, because in v4 utilities live in
   `@layer utilities` and **un-layered CSS beats layered CSS** regardless of specificity. Removing the
   reset fixed padding app-wide. Lesson: understand CSS cascade layers.
2. **MUI (emotion) styles are un-layered too**, so a plain Tailwind `hidden` on an MUI `SvgIcon` lost
   to MUI's `display:inline-block` — a responsive icon rendered twice on mobile. Fix: use a single
   icon / wrap MUI nodes in a plain element for display toggling, or use `!important` utilities.
3. **MUI icon import names** must match exactly (`DeleteOutlineOutlined`, not `DeleteOutline`) or Vite
   fails to resolve — verified names against `node_modules` before importing.

---

## 7. Likely interview questions & crisp answers

**Q: Why Redux instead of Context / useState?**
Filter state is read/written from many places (navbar search, sidebar, listing, URL sync) and drives
derived data. Redux gives a single source of truth, devtools, and clean separation. Context would
cause broad re-renders and get messy with this many interacting values.

**Q: How do filters combine?**
All in one pure function `filterProducts(products, {minPrice,maxPrice,selectedBrands,searchQuery})`,
then `sortProducts`, then `paginateProducts`. Category is applied at the API level (separate fetch).

**Q: How does pagination reset on filter change?**
Each filter reducer sets `currentPage = 1`. Deterministic, no effect chains.

**Q: How are previously selected filters preserved on Back?**
Filters are encoded in the URL. `navigate(-1)` restores the previous URL; `useQueryParams` rehydrates
Redux from it on mount. (Redux also survives SPA navigation, but URL makes it refresh/share-safe.)

**Q: Loading & error handling?**
`productsSlice.status` = idle/loading/succeeded/failed. Listing shows `<Loader>` (skeletons) on
loading and `<ErrorMessage onRetry>` on failure; detail has its own status + retry.

**Q: Why fetch all products at once instead of API pagination?**
Because price/brand/search filters run client-side after fetch; API `limit/skip` would paginate the
*unfiltered* set. The catalog is small, so this is simple and instant. For a huge catalog I'd move
filtering server-side and use `limit/skip`.

**Q: How is search implemented and why not the API?**
Debounced input → Redux `searchQuery` → client-side substring match on title/brand/category, synced
to `?q=`. The API's `/products/search` can't be combined with a category filter in one call, and we
already hold the full set in memory — so client-side keeps all filters composable. (Easy to switch to
the API endpoint if full-catalog fuzzy search were required.)

**Q: Performance?**
`useMemo` around filter/sort/paginate; `React.lazy` route splitting; images `loading="lazy"`;
debounced inputs. Next step would be list virtualisation for very large sets.

**Q: How would you test this?**
`filterProducts` / `sortProducts` / `computeAvailableBrands` are pure → unit test with Vitest.
Component tests (RTL) for `ProductCard` (renders price/rating, click navigates) and a hook test for
`useProducts`.

**Q: Accessibility?**
Semantic elements, `aria-label`/`aria-pressed`/`aria-expanded`, keyboard-activatable cards
(`role="button"` + Enter/Space), focus rings.

---

## 8. Quick file map to name-drop

- Filtering logic → `utils/filterProducts.js`
- Thunks/state → `features/products/productsSlice.js`, `filtersSlice.js`
- URL sync → `hooks/useQueryParams.js`
- Data derivation → `hooks/useProducts.js`
- Persistence → `app/store.js` + `utils/storage.js`
- Card → `components/product/ProductCard.jsx`
- Filter UI → `components/filters/FilterPanel.jsx` (+ `FilterSidebar` drawer, `FilterSection` accordion)

---

## 9. If asked "what would you improve"
Tests, server-side search, error boundaries, list virtualisation, SWR-style caching, and dropping the
remaining MUI primitives for hand-rolled ones. (Have one concrete example ready — e.g. "I'd add a
Vitest suite for `filterProducts` first because it's pure and covers the core logic.")
