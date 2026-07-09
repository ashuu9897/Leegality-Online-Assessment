import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import FilterPanel from "./FilterPanel";
import { closeFiltersDrawer } from "../../features/ui/uiSlice";

export default function FilterSidebar({ categories, brands }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const drawerOpen = useSelector((state) => state.ui.filtersDrawerOpen);
  const close = () => dispatch(closeFiltersDrawer());

  // Close the drawer whenever the route changes (e.g. navigating to a product),
  // so it never lingers over the desktop listing's persistent sidebar.
  useEffect(() => {
    dispatch(closeFiltersDrawer());
  }, [location.pathname, dispatch]);

  return (
    <div>
      {/* Dimmed backdrop — click to close */}
      <div
        onClick={close}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        aria-label="Product filters"
        aria-hidden={!drawerOpen}
        className={`fixed left-0 top-0 z-50 w-91.25 max-w-[85vw] h-screen bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Dark account header — Amazon navy */}
        <div className="bg-[#232f3e] text-white px-6 h-15 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <PersonIcon fontSize="small" />
            </div>
            <span className="text-lg font-bold">Hello, sign in</span>
          </div>
          <IconButton
            size="small"
            onClick={close}
            className="text-white!"
            aria-label="Close menu"
          >
            <CloseIcon />
          </IconButton>
        </div>

        <div className="overflow-y-auto flex-1">
          <FilterPanel categories={categories} brands={brands} />
        </div>
      </aside>
    </div>
  );
}
