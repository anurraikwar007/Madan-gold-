import {
  LayoutDashboard,
  Package,
  FolderTree,
  TicketPercent,
  ShoppingBag,
  Gem,
  X,
  Sparkles,
  Activity,
} from "lucide-react";

import {
  NavLink,
} from "react-router-dom";

const links = [
  {
    label: "Overview",
    path: "/admin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Products",
    path: "/admin/products",
    icon: Package,
  },
  {
    label: "Categories",
    path: "/admin/categories",
    icon: FolderTree,
  },
  {
    label: "Orders",
    path: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    label: "Coupons",
    path: "/admin/coupons",
    icon: TicketPercent,
  },
];

export default function AdminSidebar({
  mobile = false,
  onClose,
}) {
  return (
    <>
      {mobile && (
        <button
          type="button"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          w-64
          flex-col
          overflow-hidden
          border-r
          border-slate-800
          bg-[#0D1017]
          text-white
          shadow-[20px_0_80px_rgba(0,0,0,.25)]
          ${
            mobile
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />

        <div className="relative flex h-[88px] items-center justify-between border-b border-slate-800 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-lg shadow-violet-500/20">
              <Gem size={20} />
            </div>

            <div>
              <p className="text-sm font-bold tracking-[.18em]">
                MADAN GOLD
              </p>

              <p className="mt-1 text-[9px] uppercase tracking-[.28em] text-slate-600">
                Admin OS
              </p>
            </div>
          </div>

          {mobile && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-500 hover:bg-slate-800 hover:text-white"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div className="relative px-3 py-7">
          <div className="mb-4 flex items-center justify-between px-3">
            <p className="text-[10px] font-bold uppercase tracking-[.25em] text-slate-600">
              Workspace
            </p>

            <Activity
              size={13}
              className="text-cyan-400"
            />
          </div>

          <nav className="space-y-1.5">
            {links.map(
              ({
                label,
                path,
                icon: Icon,
                end,
              }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `
                    group
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-3.5
                    py-3
                    text-sm
                    font-semibold
                    transition-all
                    ${
                      isActive
                        ? "bg-gradient-to-r from-violet-600/20 to-cyan-500/10 text-white ring-1 ring-violet-500/30"
                        : "text-slate-500 hover:bg-slate-800/60 hover:text-slate-200"
                    }
                  `
                  }
                >
                  <Icon
                    size={18}
                    className="shrink-0"
                  />

                  <span>{label}</span>
                </NavLink>
              )
            )}
          </nav>
        </div>

        <div className="relative mt-auto p-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#22C55E]" />

              <span className="text-xs font-semibold text-slate-300">
                System online
              </span>
            </div>

            <p className="mt-2 text-[11px] leading-5 text-slate-600">
              Admin services are ready.
            </p>

            <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-violet-500 to-cyan-400" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}