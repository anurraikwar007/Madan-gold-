import { useCallback, useEffect, useState } from "react";
import { Eye, Search, UserCheck, UserX, Trash2, Users, RefreshCw } from "lucide-react";
import {
  getAdminCustomers,
  getAdminCustomerStatistics,
  toggleAdminCustomer,
  deleteAdminCustomer,
  restoreAdminCustomer,
} from "../../api/admin.api";
import { AdminButton, AdminCard, AdminPage, AdminStatus } from "./AdminUI";

const unwrap = (response) => response?.data?.data;

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        getAdminCustomers({ page, limit: 20, search, includeDeleted: true }),
        getAdminCustomerStatistics(),
      ]);
      const data = unwrap(listRes);
      const statData = unwrap(statsRes);
      setCustomers(data?.customers || data?.docs || (Array.isArray(data) ? data : []));
      setStats(statData || {});
    } catch (error) {
      console.error("Customers load failed:", error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const toggle = async (customer) => {
    setBusyId(customer._id);
    try {
      if (customer.isDeleted) await restoreAdminCustomer(customer._id);
      else await toggleAdminCustomer(customer._id);
      await load();
    } finally { setBusyId(""); }
  };

  const remove = async (customer) => {
    if (!window.confirm(`Delete customer ${customer.name || customer.email}?`)) return;
    setBusyId(customer._id);
    try { await deleteAdminCustomer(customer._id); await load(); }
    finally { setBusyId(""); }
  };

  return (
    <AdminPage
      title="Customers"
      description="Customer accounts, status, identity and account health"
      action={<AdminButton variant="soft" onClick={load} disabled={loading}><RefreshCw size={16} /> Refresh</AdminButton>}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total customers", stats.totalCustomers ?? stats.total ?? 0, Users],
          ["Active", stats.activeCustomers ?? stats.active ?? 0, UserCheck],
          ["Inactive", stats.inactiveCustomers ?? stats.inactive ?? 0, UserX],
          ["Verified", stats.verifiedCustomers ?? stats.verified ?? 0, UserCheck],
        ].map(([label, value, Icon]) => (
          <AdminCard key={label}>
            <div className="flex items-center justify-between">
              <div><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold text-[#213C51]">{Number(value).toLocaleString("en-IN")}</p></div>
              <div className="rounded-2xl bg-[#DDAED3]/30 p-3 text-[#213C51]"><Icon size={20} /></div>
            </div>
          </AdminCard>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative max-w-xl">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name, email or phone…" className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#6594B1] focus:ring-4 focus:ring-[#6594B1]/10" />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="bg-[#F5F7F9] text-[11px] uppercase tracking-[.14em] text-slate-500">
              <tr><th className="px-5 py-4">Customer</th><th className="px-5 py-4">Customer ID</th><th className="px-5 py-4">Phone</th><th className="px-5 py-4">Verification</th><th className="px-5 py-4">Status</th><th className="px-5 py-4 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? [...Array(6)].map((_, i) => <tr key={i}><td colSpan="6" className="px-5 py-6"><div className="h-5 animate-pulse rounded bg-slate-100" /></td></tr>) : customers.map((customer) => (
                <tr key={customer._id} className="hover:bg-[#FAFBFC]">
                  <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#213C51] text-sm font-bold text-white">{(customer.name || customer.email || "C").charAt(0).toUpperCase()}</div><div><p className="font-semibold text-[#213C51]">{customer.name || "Unnamed customer"}</p><p className="text-xs text-slate-500">{customer.email}</p></div></div></td>
                  <td className="px-5 py-4"><button onClick={() => setSelected(customer)} className="font-mono text-xs text-[#6594B1] hover:underline">{customer._id}</button></td>
                  <td className="px-5 py-4 text-slate-600">{customer.phone || "—"}</td>
                  <td className="px-5 py-4"><AdminStatus active={customer.isVerified} activeText="Verified" inactiveText="Pending" /></td>
                  <td className="px-5 py-4"><AdminStatus active={customer.isActive && !customer.isDeleted} activeText="Active" inactiveText={customer.isDeleted ? "Deleted" : "Inactive"} /></td>
                  <td className="px-5 py-4"><div className="flex justify-end gap-2"><AdminButton variant="soft" onClick={() => setSelected(customer)}><Eye size={15} /> View</AdminButton><AdminButton variant="soft" loading={busyId === customer._id} onClick={() => toggle(customer)}>{customer.isDeleted ? <UserCheck size={15}/> : customer.isActive ? <UserX size={15}/> : <UserCheck size={15}/>}</AdminButton>{!customer.isDeleted && <AdminButton variant="danger" onClick={() => remove(customer)}><Trash2 size={15}/></AdminButton>}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && customers.length === 0 && <div className="p-12 text-center text-sm text-slate-500">No customers found.</div>}
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"><span className="text-slate-500">Page {page}</span><div className="flex gap-2"><AdminButton variant="soft" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</AdminButton><AdminButton variant="soft" disabled={customers.length < 20} onClick={() => setPage((p) => p + 1)}>Next</AdminButton></div></div>

      {selected && <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#213C51]/60 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}><div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#6594B1]">Customer profile</p><h3 className="mt-1 text-2xl font-bold text-[#213C51]">{selected.name || "Customer"}</h3></div><button onClick={() => setSelected(null)} className="rounded-full bg-slate-100 px-3 py-1 text-slate-500">×</button></div><div className="mt-6 grid gap-3 sm:grid-cols-2">{[["Customer ID", selected._id], ["Email", selected.email], ["Phone", selected.phone], ["Gender", selected.gender], ["Verified", selected.isVerified ? "Yes" : "No"], ["Created", selected.createdAt ? new Date(selected.createdAt).toLocaleDateString("en-IN") : "—"]].map(([k,v]) => <div key={k} className="rounded-2xl bg-[#F5F7F9] p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{k}</p><p className="mt-1 break-all text-sm font-semibold text-[#213C51]">{v || "—"}</p></div>)}</div></div></div>}
    </AdminPage>
  );
}
