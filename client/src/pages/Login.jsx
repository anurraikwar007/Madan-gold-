import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, PackageCheck, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";
import { forgotCustomerPassword } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [showPassword,setShowPassword]=useState(false);
  const [forgotMode,setForgotMode]=useState(false);
  const [email,setEmail]=useState(searchParams.get("email") || "");
  const [password,setPassword]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [message,setMessage]=useState("");

  const submit=async(e)=>{
    e.preventDefault(); setError(""); setMessage(""); setLoading(true);
    try{
      const result=await login(email.trim().toLowerCase(),password);
      if(!result.success){ setError(result.message); if(result.requiresVerification){localStorage.setItem("verificationEmail",email); navigate("/verify-email",{state:{email}});} return; }
      navigate("/");
    } finally { setLoading(false); }
  };
  const forgot=async()=>{
    if(!email.trim()){setError("Enter your email address first.");return;}
    setError("");setMessage("");setLoading(true);
    try{await forgotCustomerPassword(email.trim().toLowerCase());setMessage("If this email is registered, reset instructions have been sent.");}
    catch(err){setError(err.response?.data?.message||"Unable to process request.");}
    finally{setLoading(false);}
  };

  return <div className="min-h-[calc(100vh-80px)] bg-[#EEEEEE] px-4 py-8 sm:px-6 sm:py-12 lg:px-10">
    <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[32px] border border-[#213C51]/10 bg-white shadow-[0_30px_100px_rgba(33,60,81,.12)] lg:grid-cols-[.92fr_1.08fr]">
      <div className="relative hidden overflow-hidden bg-[#213C51] p-10 text-white lg:block xl:p-14">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#DDAED3]/25 blur-3xl"/><div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-[#6594B1]/25 blur-3xl"/>
        <div className="relative flex h-full flex-col justify-between">
          <div><div className="mb-12 flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20"><Sparkles size={18}/></div><span className="text-sm font-bold tracking-[.25em]">MADAN GOLD</span></div><p className="text-xs font-semibold uppercase tracking-[.3em] text-[#DDAED3]">Your jewellery wardrobe</p><h2 className="mt-5 font-heading text-5xl leading-[1.05] text-white xl:text-6xl">Beautiful pieces.<br/><span className="text-[#DDAED3]">One trusted account.</span></h2><p className="mt-6 max-w-md text-sm leading-7 text-white/65">Keep your orders, wishlist, addresses and recommendations together in one effortless shopping space.</p></div>
          <div className="space-y-4 text-sm text-white/80"><div className="flex items-center gap-3"><ShieldCheck size={18} className="text-[#DDAED3]"/> Secure account sessions</div><div className="flex items-center gap-3"><PackageCheck size={18} className="text-[#DDAED3]"/> Track every order</div><div className="flex items-center gap-3"><HeartHandshake size={18} className="text-[#DDAED3]"/> Save favourites for later</div></div>
        </div>
      </div>
      <div className="p-6 sm:p-10 lg:p-12 xl:p-14">
        <div className="mx-auto max-w-md">
          <div className="mb-8"><span className="text-[10px] font-bold uppercase tracking-[.28em] text-[#6594B1]">Madan Gold account</span><h1 className="mt-3 font-heading text-4xl font-semibold text-[#213C51] sm:text-5xl">{forgotMode?"Reset access":"Welcome back."}</h1><p className="mt-3 text-sm leading-6 text-slate-500">{forgotMode?"Enter your email and we’ll send password reset instructions.":"Sign in to continue shopping and manage your account."}</p></div>
          {error&&<div className="mb-5 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}{message&&<div className="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}
          {!forgotMode?<form onSubmit={submit} className="space-y-5"><label className="block"><span className="mb-2 block text-xs font-semibold uppercase tracking-[.14em] text-[#213C51]">Email address</span><input autoComplete="email" type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="h-14 w-full rounded-2xl border border-[#213C51]/12 bg-[#EEEEEE]/60 px-5 text-sm text-[#213C51] outline-none transition focus:border-[#6594B1] focus:bg-white focus:ring-4 focus:ring-[#6594B1]/10"/></label><label className="block"><div className="mb-2 flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-[.14em] text-[#213C51]">Password</span><button type="button" onClick={()=>{setForgotMode(true);setError("")}} className="text-xs font-semibold text-[#6594B1] hover:text-[#213C51]">Forgot password?</button></div><div className="relative"><input autoComplete="current-password" type={showPassword?"text":"password"} required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password" className="h-14 w-full rounded-2xl border border-[#213C51]/12 bg-[#EEEEEE]/60 px-5 pr-12 text-sm text-[#213C51] outline-none transition focus:border-[#6594B1] focus:bg-white focus:ring-4 focus:ring-[#6594B1]/10"/><button type="button" onClick={()=>setShowPassword(v=>!v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" aria-label={showPassword?"Hide password":"Show password"}>{showPassword?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label><button disabled={loading} className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#213C51] text-sm font-semibold text-white shadow-xl shadow-[#213C51]/15 transition hover:-translate-y-0.5 hover:bg-[#172D3E] disabled:opacity-60">{loading?"Signing in…":"Sign in"}<ArrowRight size={17} className="transition group-hover:translate-x-1"/></button></form>:<div className="space-y-4"><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="h-14 w-full rounded-2xl border border-[#213C51]/12 bg-[#EEEEEE]/60 px-5 text-sm outline-none focus:border-[#6594B1]"/><button disabled={loading} onClick={forgot} className="h-14 w-full rounded-2xl bg-[#213C51] text-sm font-semibold text-white disabled:opacity-60">{loading?"Sending…":"Send reset instructions"}</button><button onClick={()=>{setForgotMode(false);setError("");setMessage("")}} className="w-full py-2 text-sm font-semibold text-[#6594B1]">Back to sign in</button></div>}
          <div className="my-7 flex items-center gap-3 text-xs text-slate-400"><span className="h-px flex-1 bg-slate-200"/>New to Madan Gold?<span className="h-px flex-1 bg-slate-200"/></div><Link to="/signup" className="flex h-13 w-full items-center justify-center rounded-2xl border border-[#213C51]/15 px-4 py-3.5 text-sm font-semibold text-[#213C51] transition hover:bg-[#EEEEEE]">Create your account</Link><p className="mt-6 text-center text-[11px] leading-5 text-slate-400">By continuing, you agree to our store terms and privacy practices.</p>
        </div>
      </div>
    </div>
  </div>;
}
