import {
  Menu,
  Search,
  LogOut,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  useAuth,
} from "../../context/AuthContext";

import AdminSidebar from "./AdminSidebar";

export default function AdminHeader() {
  const {
    user,
    logout,
  } = useAuth();

  const [
    mobileOpen,
    setMobileOpen,
  ] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              setMobileOpen(true)
            }
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            <Menu size={21} />
          </button>

          <div className="hidden items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 sm:flex">
            <Search
              size={17}
              className="text-slate-400"
            />

            <input
              placeholder="Search..."
              className="w-48 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-800">
              {user?.name || "Administrator"}
            </p>

            <p className="text-[11px] text-slate-400">
              {user?.role || "Admin"}
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#B88A44] text-xs font-bold text-white">
            {(
              user?.name ||
              "A"
            )
              .charAt(0)
              .toUpperCase()}
          </div>

          <button
            onClick={logout}
            title="Logout"
            className="rounded-xl p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {mobileOpen && (
        <AdminSidebar
          mobile
          onClose={() =>
            setMobileOpen(false)
          }
        />
      )}
    </>
  );
}