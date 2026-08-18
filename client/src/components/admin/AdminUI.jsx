import {
  X,
  Loader2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export function AdminButton({
  children,
  type = "button",
  variant = "primary",
  loading = false,
  disabled = false,
  onClick,
  className = "",
  }) {
   const variants = {
  primary:
  "bg-violet-600 text-white shadow-lg shadow-violet-600/20 hover:bg-violet-500",

  gold:
    "bg-gradient-to-r from-[#B9975B] to-[#D4B77A] text-white shadow-[0_10px_28px_rgba(185,151,91,.22)] hover:brightness-105",

  danger:
    "bg-[#B94A5A] text-white shadow-[0_10px_25px_rgba(185,74,90,.16)] hover:bg-[#A53D4D]",

  success:
    "bg-[#5C8068] text-white shadow-[0_10px_25px_rgba(92,128,104,.16)] hover:bg-[#4D7059]",

  soft:
  "border border-slate-200 bg-white text-slate-600 shadow-sm hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600",

  outline:
  "border border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-600",
   };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-xl
        px-4
        py-2.5
        text-sm
        font-semibold
        transition-all
        duration-200
        active:scale-[.98]
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${variants[variant] || variants.primary}
        ${className}
      `}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      )}

      {children}
    </button>
  );
}

export function AdminToggle({
  checked,
  onChange,
  disabled = false,
  label = true,
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onChange}
      aria-pressed={checked}
      aria-label={checked ? "Hide product" : "Show product"}
      className="group inline-flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span
        className={`relative flex h-7 w-12 shrink-0 items-center rounded-full border p-1 transition-all duration-300 ${
          checked
            ? "border-violet-500 bg-gradient-to-r from-violet-600 to-indigo-500 shadow-[0_6px_18px_rgba(99,102,241,.28)]"
            : "border-slate-300 bg-slate-200 shadow-inner"
        }`}
      >
        <span
          className={`h-5 w-5 rounded-full bg-white shadow-[0_2px_7px_rgba(15,23,42,.22)] transition-transform duration-300 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </span>

      {label && (
        <span
          className={`text-xs font-bold transition-colors ${
            checked
              ? "text-violet-600"
              : "text-slate-500"
          }`}
        >
          {checked ? "Visible" : "Hidden"}
        </span>
      )}
    </button>
  );
}

export function AdminStatus({
  active,
  activeText = "Active",
  inactiveText = "Hidden",
}) {
  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        px-2.5
        py-1
        text-[11px]
        font-bold
        ${
          active
            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
            : "bg-slate-100 text-slate-500 ring-1 ring-slate-200"
        }
      `}
    >
      <span
        className={`
          h-1.5
          w-1.5
          rounded-full
          ${
            active
              ? "bg-emerald-500"
              : "bg-slate-400"
          }
        `}
      />

      {active
        ? activeText
        : inactiveText}
    </span>
  );
}

export function AdminInput({
  label,
  error,
  className = "",
  ...props
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-[11px] font-bold uppercase tracking-[.16em] text-[#827A82]">
          {label}
        </label>
      )}

      <input
        {...props}
        className={`
          w-full
          rounded-xl
          border
          border-[#E4DDD5]
          bg-[#FFFEFC]
          px-3.5
          py-3
          text-sm
          text-[#29252C]
          outline-none
          transition
          placeholder:text-[#AAA2A8]
          focus:border-[#B89468]
          focus:ring-4
          focus:ring-[#B89468]/10
          ${className}
        `}
      />

      {error && (
        <p className="text-xs text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function AdminSelect({
  label,
  children,
  ...props
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-[11px] font-bold uppercase tracking-[.16em] text-[#827A82]">
          {label}
        </label>
      )}

      <select
        {...props}
        className="
          w-full
          rounded-xl
          border
          border-[#E4DDD5]
          bg-[#FFFEFC]
          px-3.5
          py-3
          text-sm
          text-[#29252C]
          outline-none
          focus:border-[#B89468]
          focus:ring-4
          focus:ring-[#B89468]/10
        "
      >
        {children}
      </select>
    </div>
  );
}

export function AdminTextarea({
  label,
  ...props
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-[11px] font-bold uppercase tracking-[.16em] text-[#827A82]">
          {label}
        </label>
      )}

      <textarea
        {...props}
        className="
          min-h-[110px]
          w-full
          resize-y
          rounded-xl
          border
          border-[#E4DDD5]
          bg-[#FFFEFC]
          px-3.5
          py-3
          text-sm
          text-[#29252C]
          outline-none
          focus:border-[#B89468]
          focus:ring-4
          focus:ring-[#B89468]/10
        "
      />
    </div>
  );
}

export function AdminModal({
  open,
  title,
  children,
  onClose,
  width = "max-w-3xl",
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#100E14]/70 p-4 backdrop-blur-md">
      <div
        className={`
          max-h-[92vh]
          w-full
          ${width}
          overflow-hidden
          rounded-3xl
          border
          border-white/60
          bg-[#FCFAF7]
          shadow-[0_40px_120px_rgba(20,15,25,.28)]
        `}
      >
        <div className="flex items-center justify-between border-b border-[#E8E0D7] bg-white/80 px-6 py-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.25em] text-[#B89468]">
              Madan Gold
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#29252C]">
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2.5 text-[#8A8389] transition hover:bg-[#F1ECE6] hover:text-[#29252C]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[calc(92vh-90px)] overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export function AdminConfirm({
  open,
  title = "Delete item?",
  message = "This action cannot be undone.",
  loading = false,
  onCancel,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#100E14]/70 p-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-3xl border border-white/70 bg-[#FCFAF7] p-7 shadow-[0_40px_120px_rgba(20,15,25,.3)]">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <AlertTriangle size={22} />
        </div>

        <h3 className="text-xl font-bold text-[#29252C]">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-[#827A82]">
          {message}
        </p>

        <div className="mt-7 flex justify-end gap-3">
          <AdminButton
            variant="soft"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </AdminButton>

          <AdminButton
            variant="danger"
            loading={loading}
            onClick={onConfirm}
          >
            Delete
          </AdminButton>
        </div>
      </div>
    </div>
  );
}

export function AdminPage({
  title,
  description,
  action,
  children,
}) {
  return (
    <div className="space-y-7">
      <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,.06)] sm:p-9">
        <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-violet-100/70 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-cyan-100/50 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-violet-500" />

              <p className="text-[10px] font-bold uppercase tracking-[.28em] text-slate-400">
                MADAN GOLD / ADMIN
              </p>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {title}
            </h1>

            {description && (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                {description}
              </p>
            )}
          </div>

          {action}
        </div>
      </div>

      {children}
    </div>
  );
}

export function AdminCard({
  children,
  className = "",
}) {
  return (
    <div
      className={`
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-[0_14px_45px_rgba(15,23,42,.055)]
        transition-shadow
        duration-300
        hover:shadow-[0_20px_60px_rgba(15,23,42,.08)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}