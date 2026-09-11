import { motion, AnimatePresence } from "framer-motion";
import { LogOut, ShieldCheck, X } from "lucide-react";

export default function LogoutModal({ open, onCancel, onConfirm, loading = false, admin = false }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <motion.button aria-label="Close logout dialog" className="absolute inset-0 bg-[#213C51]/45 backdrop-blur-sm" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onCancel} />
          <motion.div role="dialog" aria-modal="true" initial={{opacity:0, y:20, scale:.96}} animate={{opacity:1, y:0, scale:1}} exit={{opacity:0, y:12, scale:.97}} transition={{duration:.22}} className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_30px_100px_rgba(33,60,81,.25)]">
            <button onClick={onCancel} disabled={loading} className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X size={18}/></button>
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#DDAED3]/25 text-[#213C51]"><LogOut size={24}/></div>
            <div className="flex items-center gap-2"><h3 className="font-heading text-2xl font-semibold text-[#213C51]">Sign out?</h3>{admin && <ShieldCheck size={17} className="text-[#6594B1]"/>}</div>
            <p className="mt-2 text-sm leading-6 text-slate-500">Your cart and saved account data will remain safe. You can sign back in anytime.</p>
            <div className="mt-6 flex gap-3">
              <button onClick={onCancel} disabled={loading} className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">Stay signed in</button>
              <button onClick={onConfirm} disabled={loading} className="flex-1 rounded-xl bg-[#213C51] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#213C51]/20 hover:bg-[#172D3E] disabled:opacity-60">{loading ? "Signing out…" : "Sign out"}</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
