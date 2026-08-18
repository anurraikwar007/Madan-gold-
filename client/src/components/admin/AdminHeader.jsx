import {
  Menu,
  LogOut,
  Bell,
  ShieldCheck,
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
      <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-800 bg-[#080A0F]/85 px-4 backdrop-blur-2xl sm:px-6 lg:px-8">

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() =>
              setMobileOpen(true)
            }
            className="rounded-xl p-2.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="hidden sm:block">
            <p className="text-[10px] font-bold uppercase tracking-[.25em] text-violet-400">
              Command Center
            </p>

            <p className="mt-0.5 text-sm font-semibold text-slate-200">
              Welcome back,{" "}
              {user?.name ||
                "Administrator"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 md:flex">
            <ShieldCheck
              size={15}
              className="text-emerald-400"
            />

            <span className="text-xs font-semibold text-slate-400">
              Secure
            </span>
          </div>

          <button
            type="button"
            className="relative rounded-xl border border-slate-800 bg-slate-900/70 p-2.5 text-slate-400 hover:text-white"
          >
            <Bell size={18} />

            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22D3EE]" />
          </button>

          <div className="hidden border-l border-slate-800 pl-3 text-right sm:block">
            <p className="text-sm font-bold text-slate-200">
              {user?.name ||
                "Administrator"}
            </p>

            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
              {user?.role || "Admin"}
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 text-sm font-bold text-white shadow-lg shadow-violet-500/20">
            {(
              user?.name || "A"
            )
              .charAt(0)
              .toUpperCase()}
          </div>

          <button
            type="button"
            onClick={logout}
            title="Logout"
            className="rounded-xl p-2.5 text-slate-500 hover:bg-rose-500/10 hover:text-rose-400"
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