# 🛒 Leegality — React E-Commerce Product Listing App

An **Amazon-style** product listing and detail application built with **React 19, Redux Toolkit,
React Router 7, Tailwind CSS v4, and MUI (icons + a few primitives)**. Powered by the public
[DummyJSON Products API](https://dummyjson.com/docs/products).

Built for the **Leegality Frontend Engineer Assessment**.

---

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm 9+

### Install & Run

```bash
cd ecommerce-app
npm install
npm run dev        # → http://localhost:5173
```

### Build / preview / lint

```bash
npm run build      # production build → dist/
npm run preview    # preview the production build
npm run lint       # oxlint
```

---

## Assessment requirements — where they live

| Requirement                                                      | Location                                                                   |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Listing page (filters left, grid right, pagination)              | `pages/ProductListingPage.jsx`                                             |
| Detail page                                                      | `pages/ProductDetailPage.jsx`                                              |
| Card: image, title, price, rating                                | `components/product/ProductCard.jsx`                                       |
| Card click → `/product/:id`                                      | `ProductCard` + React Router                                               |
| **Category** filter (dynamic from `/products/categories`)        | `components/filters/CategoryFilter.jsx`                                    |
| **Price range** filter (min/max)                                 | `components/filters/PriceRangeFilter.jsx`                                  |
| **Brand** filter (unique brands, multi-select)                   | `components/filters/BrandFilter.jsx`                                       |
| Combined filtering                                               | `utils/filterProducts.js`                                                  |
| Pagination resets on filter change                               | every reducer sets `currentPage = 1` (`features/products/filtersSlice.js`) |
| Loading + error states                                           | `components/common/Loader.jsx`, `ErrorMessage.jsx`                         |
| Detail: image, name, price, rating, description, brand, category | `ProductDetailPage.jsx`                                                    |
| Back button + filters preserved on back                          | Back button + URL-synced filters (`hooks/useQueryParams.js`)               |
| API endpoints used                                               | `api/productApi.js`                                                        |

---

## Project structure

```
src/
├── api/                # axios instance + endpoint wrappers
├── app/store.js        # Redux store (+ localStorage persistence for cart/wishlist)
├── features/
│   ├── products/       # productsSlice (thunks) + filtersSlice
│   ├── cart/  wishlist/  ui/
├── hooks/              # useProducts, useFilterMeta, useQueryParams, useDebounce
├── utils/              # filterProducts (pure filter/sort/brand), storage, constants
├── components/
│   ├── layout/         # Navbar, CartDrawer
│   ├── filters/        # FilterPanel, FilterSidebar (mobile drawer), each filter, FilterSection
│   ├── product/        # ProductCard, ProductGrid, RatingStars
│   └── common/         # Loader, ErrorMessage, Pagination
└── pages/              # ProductListingPage, ProductDetailPage, CheckoutPage
```

---

## Assumptions Made

- **Client-side filtering, sorting & pagination**: DummyJSON cannot express price + brand + search +
  sort in one call, so the (small, ~194-item) catalog is fetched per category and combined
  **client-side** in `utils/filterProducts.js`. Pure functions, memoised with `useMemo`.
- **Category filtering uses the API**: `/products/category/{category}` when a category is selected,
  otherwise `/products?limit=194`.
- **Brand list from the full catalog**: DummyJSON has no brand endpoint, so brands are fetched once
  via `/products?limit=0&select=brand` and de-duplicated (`computeAvailableBrands`) — so the filter
  is always complete regardless of the selected category. Some products lack a `brand`.
- **Prices** are shown in USD as returned by the API.

---

## Architectural Decisions

### URL as source of truth for filter state

Filter state (category, price, brands, search, sort, page) lives in Redux **and** is mirrored in the
URL via `hooks/useQueryParams.js`. On mount Redux hydrates from the URL; on change the URL updates
(`replace`). Result: browser back/forward and the detail page’s Back button preserve filters, and
filtered views are shareable / refresh-safe.

### Redux Toolkit for shared state

`productsSlice` (API data) and `filtersSlice` (user selections) are separate. Presentational
components receive props only; container logic lives in `pages/` and `hooks/useProducts.js`.
`cart` and `wishlist` are persisted to `localStorage` via a single `store.subscribe` listener and
rehydrated with `preloadedState`.

### Page reset inside the reducer

Every filter action resets `currentPage` to 1 **in the same reducer**, avoiding `useEffect` races.

### Debounced inputs

Search and price inputs use `useDebounce(300ms)` before dispatching, preventing a re-filter on every
keystroke.

### Code splitting

The three pages are lazy-loaded (`React.lazy` + `Suspense`) for a smaller initial bundle.

### MUI used sparingly

Only icons + `Rating`, `Skeleton`, `Drawer`, `Pagination`. All layout/styling is Tailwind.

---

## Features (including beyond the brief)

- Combined **filters**: category, price range, brand (multi-select), plus global **search**.
- **Sort** by price ↑/↓, rating, biggest discount.
- **Responsive layout**: persistent left filter sidebar on desktop; slide-in drawer with a dimmed
  backdrop on mobile/tablet.
- **Cart** drawer with quantity controls + **checkout** page (form validation + order confirmation).
- **Wishlist** heart toggle on cards.
- **localStorage persistence** for cart & wishlist (survives refresh).
- Detail page: image gallery with thumbnails, **quantity selector**, **low-stock** messaging,
  reviews, and related products.
- **Scroll-position restore** when returning to the listing from a detail page.
- Loading skeletons, error + retry states, accessible aria labels, custom scrollbar.

---

## Improvements Given More Time

- **Unit/integration tests**: `filterProducts`/`sortProducts` are pure and trivial to test with
  Vitest; add a `ProductCard` + `useProducts` test.
- **Server-side search** via `/products/search?q=` (trade-off: can’t combine with category on the
  API — see the note in code review).
- **Virtualised grid** (`@tanstack/react-virtual`) for very large result sets.
- **Error boundaries** around pages.
- **SWR-style caching** of API responses in Redux with timestamps to skip recent re-fetches.
- Replace remaining MUI primitives with custom components to fully honour “avoid heavy UI libraries”.
- **Share products**: a Share button on the detail page using the browser **Web Share API**
  (`navigator.share`) on mobile, with a "copy link to clipboard" fallback on desktop — so a shopper can
  send a specific product link to someone.
- **Open Graph library for sharing (rich link previews)**: inject per-product **Open Graph / Twitter
  Card** meta tags (title, description, image, price) into `<head>` — e.g. via `react-helmet-async` or
  React 19's native `<title>`/`<meta>` hoisting — so a pasted product link renders a rich preview card
  (image + title + price) in WhatsApp / Slack / iMessage / Twitter instead of a bare URL. Full previews
  for non-JS crawlers would need SSR/prerender (Next.js), the natural next step.
- Implement a zoom effect when hovering over the image.
