// import { Button } from "@/components/ui/button";

// const Home = () => {
//   return (
//     <div className="w-full bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 relative overflow-hidden text-slate-100 antialiased">
//       {/* Subtle animated background blobs */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute -left-40 -top-20 w-[520px] h-[520px] bg-indigo-700/8 rounded-full blur-3xl animate-slow-pulse" />
//         <div className="absolute right-0 top-32 w-[420px] h-[420px] bg-teal-600/6 rounded-full blur-3xl animate-slow-pulse delay-700" />
//         <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] bg-violet-600/5 rounded-full blur-2xl animate-slow-pulse delay-350" />
//       </div>

//       {/* Very subtle grid overlay for texture */}
//       <div
//         className="absolute inset-0 opacity-6"
//         style={{
//           backgroundImage:
//             "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)",
//           backgroundSize: "56px 56px",
//         }}
//       />

//       {/* Navigation */}
//       <nav className="relative z-10 w-full px-20 py-6 flex items-center justify-between">
//         <div className="flex items-center gap-6">
//           <div className="text-2xl font-extrabold tracking-tight">
//             Expense
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-teal-300">
//               Tracker
//             </span>
//           </div>
//           {/* slim tagline only on large screens */}
//           <div className="hidden lg:block text-slate-400">Professional personal finance</div>
//         </div>

//         <div className="flex items-center gap-6">
//           <a className="hidden md:inline text-slate-300 hover:text-slate-100 transition">Features</a>
//           <a className="hidden md:inline text-slate-300 hover:text-slate-100 transition">Pricing</a>
//           <a className="hidden md:inline text-slate-300 hover:text-slate-100 transition">About</a>
//           <div className="flex items-center gap-3">
//             <Button variant="outline" className="hidden sm:inline border-slate-700 text-slate-200 hover:bg-slate-800/40">
//               Sign In
//             </Button>
//             <Button className="bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-700 hover:to-teal-600 px-5 py-2 shadow-md">
//               Register
//             </Button>
//           </div>
//         </div>
//       </nav>

//       {/* Main content area - desktop-first and full width */}
//       <main className="relative z-10 px-20 pb-16">
//         {/* Hero */}
//         <section className="w-full flex items-center justify-between gap-12 pt-8">
//           {/* Hero text - allow it to breathe with wide line length for desktop */}
//           <div className="flex-1 max-w-[900px]">
//             <div className="inline-block px-4 py-2 rounded-full bg-indigo-700/10 border border-indigo-700/8 text-indigo-200 mb-6">
//               ✨ Now with AI-powered insights
//             </div>

//             <h1 className="text-[68px] leading-tight font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-indigo-200 to-teal-200 mb-6">
//               Master your financial future with a calm, deliberate approach.
//             </h1>

//             <p className="text-lg text-slate-300 max-w-2xl mb-8">
//               Track spending across accounts, get clear monthly breakdowns, and receive
//               practical recommendations — no flash, just clarity. Designed for people who
//               want control, not noise.
//             </p>

//             <div className="flex items-center gap-4">
//               <Button
//                 size="lg"
//                 className="bg-gradient-to-r from-indigo-600 to-teal-500 hover:from-indigo-700 hover:to-teal-600 shadow-md px-6 py-3"
//               >
//                 Start Free Trial
//               </Button>
//               <Button
//                 variant="outline"
//                 size="lg"
//                 className="px-6 py-3 border-slate-700 text-slate-200 hover:bg-slate-800/40"
//               >
//                 Watch Demo
//               </Button>
//             </div>
//           </div>

//           {/* Illustration / empty space — intentionally full height block but not narrow */}
//           <div className="flex-1 hidden lg:flex items-center justify-center">
//             <div className="w-[420px] h-[420px] rounded-2xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/40 backdrop-blur-sm shadow-xl flex items-center justify-center">
//               {/* placeholder illustration/asset area — replace with SVG or image */}
//               <div className="text-center text-slate-300">
//                 <div className="text-2xl font-semibold mb-2">Your Data, Visualized</div>
//                 <div className="text-sm max-w-xs">
//                   Clean charts, effortless filters, and insightful summaries.
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Feature cards — full width, larger proportions for desktop */}
//         <section className="mt-16">
//           <div className="grid grid-cols-3 gap-8">
//             {[
//               {
//                 title: "Smart Analytics",
//                 desc:
//                   "Visualize spending trends, pockets of waste, and recurring charges—clear, actionable charts.",
//                 tone: "from-indigo-600 to-indigo-500",
//               },
//               {
//                 title: "Bank-Level Security",
//                 desc:
//                   "Encrypted at rest and transit with industry standard practices so your data stays safe.",
//                 tone: "from-teal-500 to-teal-400",
//               },
//               {
//                 title: "Seamless Sync",
//                 desc:
//                   "Auto-sync accounts and devices for a single source of truth on your finances.",
//                 tone: "from-rose-500 to-pink-500",
//               },
//             ].map((c, i) => (
//               <div
//                 key={i}
//                 className="p-8 rounded-2xl bg-slate-800/60 border border-slate-700/40 backdrop-blur-sm shadow-md hover:-translate-y-2 transform transition"
//               >
//                 <div
//                   className={`w-14 h-14 rounded-lg mb-5 flex items-center justify-center bg-gradient-to-br ${c.tone} text-white shadow-sm`}
//                 >
//                   {/* Simple icon (replace with real svg) */}
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5" />
//                   </svg>
//                 </div>
//                 <h3 className="text-xl font-semibold text-slate-100 mb-3">{c.title}</h3>
//                 <p className="text-slate-400">{c.desc}</p>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Metrics / stats row — tuned for desktop */}
//         <section className="mt-20 grid grid-cols-4 gap-8 text-center">
//           {[
//             { label: "Active Users", value: "500K+" },
//             { label: "Value Tracked", value: "$2.5B+" },
//             { label: "Uptime", value: "99.9%" },
//             { label: "Rating", value: "4.9★" },
//           ].map((s, i) => (
//             <div key={i} className="p-6 rounded-xl bg-slate-800/50 border border-slate-700/30">
//               <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-teal-300">
//                 {s.value}
//               </div>
//               <div className="text-slate-400 mt-2">{s.label}</div>
//             </div>
//           ))}
//         </section>
//       </main>

//       {/* subtle bottom glow */}
//       <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none" />
//     </div>
//   );
// };

// export default Home;
