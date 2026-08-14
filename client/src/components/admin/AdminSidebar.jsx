import {
  LayoutDashboard,
  Package,
  FolderTree,
  TicketPercent,
  ShoppingBag,
  Gem,
  X,
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
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-[#17202B] text-white ${
          mobile
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-[72px] items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B88A44]">
              <Gem size={20} />
            </div>

            <div>
              <p className="text-sm font-bold">
                MADAN GOLD
              </p>

              <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
                Admin Console
              </p>
            </div>
          </div>

          {mobile && (
            <button
              onClick={onClose}
              className="text-slate-400"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div className="px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Management
          </p>

          <nav className="space-y-1">
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
                    `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-[#B88A44] text-white shadow-lg shadow-black/10"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  <Icon size={18} />
                  {label}
                </NavLink>
              )
            )}
          </nav>
        </div>

        <div className="mt-auto border-t border-white/10 p-5">
          <p className="text-xs text-slate-500">
            Madan Gold
          </p>

          <p className="mt-1 text-[11px] text-slate-600">
            Secure Administration
          </p>
        </div>
      </aside>
    </>
  );
}