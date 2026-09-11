import { useCallback, useEffect, useState } from "react";
import { Check, Eye, Search, Star, Trash2, X } from "lucide-react";
import { getAdminReviews, updateAdminReviewApproval, deleteAdminReview } from "../../api/admin.api";
import { AdminButton, AdminPage, AdminStatus } from "./AdminUI";

const unwrap = (r) => r?.data?.data;
export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = unwrap(await getAdminReviews({ page: 1, limit: 100, search }));
      setReviews(data?.reviews || data?.docs || (Array.isArray(data) ? data : []));
    } catch (e) { console.error("Reviews load failed:", e); setReviews([]); }
    finally { setLoading(false); }
  }, [search]);
  useEffect(() => { const t=setTimeout(load,250); return ()=>clearTimeout(t); }, [load]);
  const approval = async (review) => { await updateAdminReviewApproval(review._id, !review.isApproved); await load(); };
  const remove = async (review) => { if (!window.confirm("Delete this review?")) return; await deleteAdminReview(review._id); await load(); };
  return <AdminPage title="Reviews" description="Moderate ratings, customer feedback and purchase-backed reviews">
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="relative max-w-xl"><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search reviews…" className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-[#6594B1]"/></div></div>
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-[#F5F7F9] text-[11px] uppercase tracking-[.14em] text-slate-500"><tr><th className="px-5 py-4">Review</th><th className="px-5 py-4">Customer</th><th className="px-5 py-4">Rating</th><th className="px-5 py-4">Purchase</th><th className="px-5 py-4">Status</th><th className="px-5 py-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{loading ? [...Array(5)].map((_,i)=><tr key={i}><td colSpan="6" className="px-5 py-7"><div className="h-5 animate-pulse rounded bg-slate-100"/></td></tr>) : reviews.map(r=><tr key={r._id} className="hover:bg-slate-50"><td className="px-5 py-4"><p className="font-semibold text-[#213C51]">{r.title || "Untitled review"}</p><p className="mt-1 max-w-[340px] truncate text-xs text-slate-500">{r.comment}</p></td><td className="px-5 py-4 text-slate-600">{r.customer?.name || r.customer?.email || r.customer || "—"}</td><td className="px-5 py-4"><span className="inline-flex items-center gap-1 font-bold text-[#213C51]"><Star size={15} fill="currentColor"/>{r.rating}/5</span></td><td className="px-5 py-4"><AdminStatus active={!!r.isVerifiedPurchase} activeText="Verified" inactiveText="Unverified"/></td><td className="px-5 py-4"><AdminStatus active={r.isApproved !== false} activeText="Approved" inactiveText="Hidden"/></td><td className="px-5 py-4"><div className="flex justify-end gap-2"><AdminButton variant="soft" onClick={()=>setSelected(r)}><Eye size={15}/> View</AdminButton><AdminButton variant="soft" onClick={()=>approval(r)}>{r.isApproved===false?<Check size={15}/>:<X size={15}/>}</AdminButton><AdminButton variant="danger" onClick={()=>remove(r)}><Trash2 size={15}/></AdminButton></div></td></tr>)}</tbody></table></div>{!loading && reviews.length===0 && <div className="p-12 text-center text-sm text-slate-500">No reviews found.</div>}</div>
    {selected && <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#213C51]/60 p-4 backdrop-blur-sm" onClick={()=>setSelected(null)}><div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl" onClick={e=>e.stopPropagation()}><div className="flex justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-[#6594B1]">Customer review</p><h3 className="mt-1 text-xl font-bold text-[#213C51]">{selected.title}</h3></div><button onClick={()=>setSelected(null)} className="text-2xl text-slate-400">×</button></div><div className="mt-5 flex items-center gap-1 text-[#213C51]">{[1,2,3,4,5].map(n=><Star key={n} size={17} fill={n<=selected.rating?"currentColor":"none"}/>)}</div><p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-600">{selected.comment}</p></div></div>}
  </AdminPage>;
}
