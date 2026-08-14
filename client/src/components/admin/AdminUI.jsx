import {
  X,
  Loader2,
  AlertTriangle,
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
      "bg-slate-900 text-white hover:bg-slate-800",
    gold:
      "bg-[#B88A44] text-white hover:bg-[#9f7537]",
    danger:
      "bg-rose-600 text-white hover:bg-rose-700",
    soft:
      "bg-slate-100 text-slate-700 hover:bg-slate-200",
    outline:
      "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {loading && (
        <Loader2
          size={16}
          className="animate-spin"
        />
      )}

      {children}
    </button>
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
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </label>
      )}

      <input
        {...props}
        className={`w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#B88A44] focus:ring-4 focus:ring-[#B88A44]/10 ${className}`}
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
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </label>
      )}

      <select
        {...props}
        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-[#B88A44] focus:ring-4 focus:ring-[#B88A44]/10"
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
        <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </label>
      )}

      <textarea
        {...props}
        className="min-h-[110px] w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-[#B88A44] focus:ring-4 focus:ring-[#B88A44]/10"
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div
        className={`max-h-[92vh] w-full ${width} overflow-hidden rounded-2xl bg-white shadow-2xl`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-bold text-slate-900">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[calc(92vh-70px)] overflow-y-auto p-5">
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
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
          <AlertTriangle size={21} />
        </div>

        <h3 className="text-lg font-bold text-slate-900">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {message}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <AdminButton
            variant="soft"
            onClick={onCancel}
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
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>

          {description && (
            <p className="mt-1 text-sm text-slate-500">
              {description}
            </p>
          )}
        </div>

        {action}
      </div>

      {children}
    </div>
  );
}