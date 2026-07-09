import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IconButton, Badge, Menu, MenuItem, Divider } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { setSearchQuery } from "../../features/products/filtersSlice";
import {
  toggleFiltersDrawer,
  toggleDesktopSidebar,
  openCartDrawer,
} from "../../features/ui/uiSlice";
import { useDebounce } from "../../hooks/useDebounce";
import { DEBOUNCE_DELAY } from "../../utils/constants";

function NavItem({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-start justify-center leading-tight px-2 py-1 rounded border border-transparent hover:border-white transition-colors text-left ${className}`}
    >
      {children}
    </button>
  );
}

function SearchForm({ query, setQuery, onSubmit, className = "" }) {
  return (
    <form
      onSubmit={onSubmit}
      className={`flex h-10 sm:h-11 rounded-md overflow-hidden ring-1 ring-transparent focus-within:ring-2 focus-within:ring-yellow-400 ${className}`}
    >
      <div className="relative flex-1 min-w-0">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, brands and categories..."
          aria-label="Search products"
          className="w-full h-full bg-white text-gray-900 placeholder-gray-500 pl-3 sm:pl-6 pr-9 text-sm outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <CloseIcon fontSize="small" />
          </button>
        )}
      </div>
      <button
        type="submit"
        aria-label="Search"
        className="w-11 sm:w-12 shrink-0 bg-yellow-400 hover:bg-yellow-300 flex items-center justify-center text-gray-900"
      >
        <SearchIcon />
      </button>
    </form>
  );
}

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((n, i) => n + i.qty, 0),
  );
  const reduxQuery = useSelector((state) => state.filters.searchQuery);

  const [query, setQuery] = useState(reduxQuery);
  const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY);
  const [profileAnchor, setProfileAnchor] = useState(null);

  useEffect(() => {
    dispatch(setSearchQuery(debouncedQuery));
  }, [debouncedQuery, dispatch]);

  useEffect(() => {
    setQuery(reduxQuery);
  }, [reduxQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (window.location.pathname !== "/") navigate("/");
  };

  const handleHamburger = () => {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const isListing = location.pathname === "/";
    // The persistent sidebar only exists on the listing page at desktop widths —
    // there the hamburger collapses/expands it. Everywhere else (mobile, or the
    // detail/checkout pages) it opens the overlay filter drawer.
    if (isDesktop && isListing) {
      dispatch(toggleDesktopSidebar());
    } else {
      dispatch(toggleFiltersDrawer());
    }
  };

  return (
    <nav className="bg-gray-900 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-[1920px] mx-auto px-2 sm:px-4">
        {/* ===== Row 1 ===== */}
        <div className="flex items-center gap-1 sm:gap-3 h-14 sm:h-16">
          {/* Left: hamburger + logo + location */}
          <div className="flex items-center gap-0.5 sm:gap-2 shrink-0 min-w-0">
            <IconButton
              onClick={handleHamburger}
              className="text-white!"
              aria-label="Toggle filters"
              size="medium"
            >
              <MenuIcon />
            </IconButton>

            <Link
              to="/"
              className="flex items-center rounded shrink-0"
              aria-label="Leegality home"
            >
              <span className="bg-white rounded-md px-2 py-1.5 flex items-center">
                <img
                  src="https://cdn.prod.website-files.com/5fef5231c8595fadb2b2a3cf/65a63eabd7998b73d63869c4_logo%20leegality%201.svg"
                  alt="Leegality"
                  className="h-5 sm:h-6 w-auto"
                />
              </span>
            </Link>

            <NavItem className="hidden lg:flex shrink-0">
              <span className="flex items-center gap-1 text-xs text-gray-300">
                <LocationOnOutlinedIcon sx={{ fontSize: 16 }} />
                Plot No. 444, Udyog Vihar Phase 3,
              </span>
              <span className="text-sm font-bold text-white">
                Update location
              </span>
            </NavItem>
          </div>

          {/* Middle: search bar — hidden on mobile, shown from sm upward */}
          <div className="hidden sm:block flex-1 min-w-0">
            <SearchForm
              query={query}
              setQuery={setQuery}
              onSubmit={handleSubmit}
            />
          </div>

          {/* Mobile spacer so right-side icons stay pinned right */}
          <div className="flex-1 sm:hidden" />

          {/* Right: account, orders, cart */}
          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 pr-0.5 sm:pr-1 ">
            <NavItem
              onClick={(e) => setProfileAnchor(e.currentTarget)}
              className="hidden md:flex"
            >
              <span className="text-xs text-gray-300">Hello, sign in</span>
              <span className="text-sm font-bold text-white flex items-center">
                Account &amp; Lists
                <ArrowDropDownIcon fontSize="small" />
              </span>
            </NavItem>

            <NavItem className="hidden lg:flex">
              <span className="text-xs text-gray-300">Returns</span>
              <span className="text-sm font-bold text-white">&amp; Orders</span>
            </NavItem>

            <button
              onClick={() => dispatch(openCartDrawer())}
              aria-label="Open cart"
              className="flex items-end gap-1 px-1.5 sm:px-2 py-1.5 sm:ml-1 rounded border border-transparent hover:border-white transition-colors"
            >
              <Badge badgeContent={cartCount} color="warning">
                <ShoppingCartOutlinedIcon />
              </Badge>
              <span className="text-sm font-bold hidden md:inline">Cart</span>
            </button>

            {/* Icon-only account button for mobile/tablet (below md) */}
            <IconButton
              onClick={(e) => setProfileAnchor(e.currentTarget)}
              className="text-white! md:hidden!"
              aria-label="Account menu"
              size="medium"
            >
              <ArrowDropDownIcon />
            </IconButton>

            <Menu
              anchorEl={profileAnchor}
              open={Boolean(profileAnchor)}
              onClose={() => setProfileAnchor(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={() => setProfileAnchor(null)}>
                Sign in
              </MenuItem>
              <MenuItem onClick={() => setProfileAnchor(null)}>
                Create account
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => setProfileAnchor(null)}>Orders</MenuItem>
              <MenuItem onClick={() => setProfileAnchor(null)}>
                Wishlist
              </MenuItem>
            </Menu>
          </div>
        </div>

        {/* ===== Row 2 (mobile only): full-width search bar ===== */}
        <div className="sm:hidden pb-2">
          <SearchForm
            query={query}
            setQuery={setQuery}
            onSubmit={handleSubmit}
          />
        </div>

        {/* ===== Row 3 (mobile/tablet only): location strip, Amazon-style ===== */}
        <button
          onClick={() => dispatch(toggleFiltersDrawer())}
          className="lg:hidden flex items-center gap-1 text-xs text-gray-300 pb-2 -mt-1"
        >
          <LocationOnOutlinedIcon sx={{ fontSize: 14 }} />
          <span>
            Plot No. 444, Udyog Vihar Phase 3, ·{" "}
            <span className="font-bold text-white">Update location</span>
          </span>
        </button>
      </div>
    </nav>
  );
}
