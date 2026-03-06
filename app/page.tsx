"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const infoRef = useRef<HTMLElement>(null);
  const rsvpRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      gsap.to(dotRef.current, { x: clientX, y: clientY, duration: 0 });
      gsap.to(outlineRef.current, { x: clientX, y: clientY, duration: 0.5, ease: "power3.out" });
      if (glowRef.current) {
        glowRef.current.style.setProperty("--x", `${clientX}px`);
        glowRef.current.style.setProperty("--y", `${clientY}px`);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    const handleMouseDown = () => gsap.to(outlineRef.current, { scale: 0.7, duration: 0.2 });
    const handleMouseUp = () => gsap.to(outlineRef.current, { scale: 1, duration: 0.2 });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
    const titleElement = titleRef.current;
    if (titleElement) {
      let iterations = 0;
      const interval = setInterval(() => {
        titleElement.innerText = titleElement.innerText.split("").map((_, i) => 
          i < iterations ? titleElement.dataset.value![i] : letters[Math.floor(Math.random() * 40)]
        ).join("");
        if (iterations >= titleElement.dataset.value!.length) clearInterval(interval);
        iterations += 1/3;
      }, 50);
    }

    const ctx = gsap.context(() => {
      gsap.from(".animate-hero", { y: 30, opacity: 0, stagger: 0.1, duration: 1, ease: "power3.out" });
      gsap.from(".info-card", { scrollTrigger: { trigger: infoRef.current, start: "top 70%" }, y: 50, opacity: 0, stagger: 0.2, duration: 0.8 });
      gsap.from(".faq-item", { scrollTrigger: { trigger: faqRef.current, start: "top 80%" }, x: -30, opacity: 0, stagger: 0.1, duration: 0.8 });
    }, containerRef);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      ctx.revert();
    };
  }, []);

  const handleMouseClick = (e: React.MouseEvent) => {
    const newRipple = { id: Date.now(), x: e.clientX, y: e.clientY };
    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== newRipple.id)), 600);
  };

  const faqData = [
    { q: "HOW TO GET THE PASS?", a: "After completing the RSVP terminal, the system will process your ID and deploy your unique access token via encrypted channel." },
    { q: "DRESS CODE PROTOCOL?", a: "Neo-Industrial or Techwear aesthetics are highly recommended for full environmental integration." },
    { q: "GUEST ACCESS?", a: "Each access protocol is individual and non-transferable. Extra invites must be requested via the command terminal." }
  ];

  return (
    <main 
      ref={containerRef} 
      className="bg-background text-white font-mono relative min-h-screen overflow-x-hidden"
      onClick={handleMouseClick}
    >
      <div className="grain fixed inset-0 z-[90] pointer-events-none opacity-[0.03]"></div>
      <div ref={dotRef} className="cursor-dot hidden md:block"></div>
      <div ref={outlineRef} className="cursor-outline hidden md:block"></div>
      
      <div 
        ref={glowRef} 
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        style={{
          maskImage: 'radial-gradient(circle 350px at var(--x, 50%) var(--y, 50%), black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(circle 350px at var(--x, 50%) var(--y, 50%), black 40%, transparent 100%)',
        }}
      >
        <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-50 contrast-125">
          <source src="/bg-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-neon/5 mix-blend-color"></div>
      </div>

      <div className="fixed inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none z-[-1]"></div>

      {ripples.map((r) => (
        <div key={r.id} className="fixed pointer-events-none border border-neon rounded-full animate-ping z-50 w-10 h-10"
          style={{ left: r.x - 20, top: r.y - 20 }}
        ></div>
      ))}

      {/* --- HEADER --- */}
      <nav className="fixed top-0 w-full p-6 flex justify-between items-start z-[100] mix-blend-difference">
        <div className="text-xl font-black tracking-tighter italic">EVENTATION<span className="text-neon">.</span></div>
        <div className="flex flex-col items-end gap-1 text-[9px] tracking-[0.2em] text-neon uppercase font-bold">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-neon rounded-full animate-pulse"></span>
            CONNECTION: STABLE
          </div>
          <div className="text-white/40">LATENCY: 12ms</div>
        </div>
      </nav>

      {/* --- HERO --- */}
      <section className="h-screen flex flex-col items-center justify-center relative z-10 px-4">
        <div className="text-center space-y-6">
          <p className="animate-hero text-neon text-[10px] tracking-[0.6em] uppercase">[ INITIATING_LANDING_SEQUENCE ]</p>
          <h1 ref={titleRef} data-value="EVENTATION" className="animate-hero text-6xl md:text-[12rem] font-black tracking-tighter leading-none uppercase drop-shadow-2xl">
            EVENTATION
          </h1>
          <div className="animate-hero max-w-xl mx-auto border-y border-white/10 py-6 flex justify-around items-center">
            <div className="text-left">
              <p className="text-[10px] text-muted tracking-widest uppercase">Location</p>
              <p className="text-sm font-bold tracking-tighter">SECTOR_ALFA // 42</p>
            </div>
            <div className="h-8 w-[1px] bg-white/10"></div>
            <div className="text-right">
              <p className="text-[10px] text-muted tracking-widest uppercase">Timeline</p>
              <p className="text-sm font-bold tracking-tighter">NOV_15.2026 // 23:00</p>
            </div>
          </div>
          <button 
            onClick={() => rsvpRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="animate-hero px-12 py-4 bg-transparent border border-neon text-neon text-xs font-bold tracking-[0.3em] uppercase hover:bg-neon hover:text-black transition-all duration-500"
          >
            Access Protocol
          </button>
        </div>
      </section>

      {/* --- TICKER --- */}
      <div className="w-full bg-neon text-background py-2 overflow-hidden whitespace-nowrap font-black text-[10px] uppercase z-20 relative">
        <div className="inline-block animate-[marquee_25s_linear_infinite]">
          {Array(10).fill(" /// EVENTATION PROTOCOL ACTIVE /// RESTRICTED ACCESS /// NO PHOTOGRAPHY /// ENCRYPTED INVITE ONLY ").join("")}
        </div>
      </div>

      {/* --- INTEL --- */}
      <section ref={infoRef} className="max-w-6xl mx-auto py-40 px-6 z-10 relative">
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { label: "COORDINATES", val: "Industrial Sector 42", sub: "Entrance via east alley. Scan for 440Hz frequency light beacon." },
            { label: "SECURITY", val: "Level 9 Clearance", sub: "Digital ID presentation is mandatory at the first perimeter breach." }
          ].map((item, i) => (
            <div key={i} className="info-card relative p-12 bg-surface/20 backdrop-blur-3xl border border-white/5 group hover:border-neon/30 transition-all duration-500">
              <div className="absolute top-0 left-0 w-6 h-1 bg-neon scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
              <p className="text-neon text-[9px] tracking-widest mb-6 opacity-60 font-bold">// 0{i+1}_{item.label}</p>
              <h2 className="text-3xl font-bold tracking-tighter mb-4 uppercase">{item.val}</h2>
              <p className="text-muted text-sm leading-relaxed tracking-tight">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- FAQ --- */}
      <section ref={faqRef} className="max-w-3xl mx-auto py-20 px-6 z-10 relative">
        <h3 className="text-xs text-neon tracking-[0.4em] mb-12 uppercase opacity-50 text-center font-bold">Additional_Intel</h3>
        <div className="space-y-4">
          {faqData.map((item, i) => (
            <div key={i} className="faq-item border border-white/10 bg-surface/10 overflow-hidden transition-colors hover:border-white/20">
              <button 
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full p-6 text-left flex justify-between items-center"
              >
                <span className="text-sm font-bold tracking-widest uppercase">{item.q}</span>
                <span className={`text-neon transition-transform duration-300 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              <div className={`transition-all duration-500 ease-in-out px-6 ${openFaq === i ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-muted text-[11px] leading-relaxed uppercase tracking-wider">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- TERMINAL RSVP --- */}
      <section ref={rsvpRef} className="h-screen flex items-center justify-center p-6 z-10 relative">
        <div className="terminal-window w-full max-w-2xl border border-white/10 bg-black/80 backdrop-blur-2xl">
          <div className="bg-[#111] border-b border-white/10 px-4 py-2 flex items-center justify-between font-mono">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-white/5"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-white/5"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-white/5"></div>
            </div>
            <span className="text-[10px] text-muted tracking-widest uppercase font-bold">Access_Terminal_v2.0</span>
            <div className="w-10"></div>
          </div>
          <div className="p-8 space-y-8">
            <p className="text-neon text-xs tracking-widest underline underline-offset-4 uppercase font-bold tracking-[0.2em]">Login_Sequence_Required</p>
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-white/40 tracking-widest uppercase font-bold">Subject_Identity</label>
                  <div className="flex items-center border-b border-white/10 focus-within:border-neon transition-colors pb-2">
                    <span className="text-neon mr-3 font-bold">{'>'}</span>
                    <input type="text" className="bg-transparent border-none outline-none w-full text-sm font-mono" placeholder="Input guest name..." />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] text-white/40 tracking-widest uppercase font-bold">Comm_Channel</label>
                  <div className="flex items-center border-b border-white/10 focus-within:border-neon transition-colors pb-2">
                    <span className="text-neon mr-3 font-bold">{'>'}</span>
                    <input type="email" className="bg-transparent border-none outline-none w-full text-sm font-mono" placeholder="email@protocol.xyz" />
                  </div>
                </div>
              </div>
              <button className="w-full bg-neon text-black py-4 font-black text-xs tracking-[0.3em] uppercase hover:bg-white transition-all">
                Generate Access Token
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* --- FOOTER SECTION --- */}
      <footer className="w-full py-20 px-6 border-t border-white/5 relative z-10 bg-black/50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* Lado Esquerdo: Branding */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="text-xl font-black tracking-tighter uppercase">
              Eventation<span className="text-neon">_</span>
            </div>
            <p className="text-[10px] text-muted tracking-[0.3em] uppercase">
              Terminal de Acess v1.0.4
            </p>
          </div>

          {/* Centro: Status / Info */}
          <div className="hidden lg:block text-[9px] text-white/20 tracking-[0.5em] uppercase text-center">
            [ Encrypted Connection // 2026 Protocol ]
          </div>

          {/* Lado Direito: Social / LinkedIn */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <p className="text-[10px] text-muted tracking-widest uppercase">Connect_Developer</p>
            <a 
              href="https://br.linkedin.com/in/leonardo-gaertner-93a087245" 
              target="_blank"
              rel="noopener noreferrer"
              className="group relative px-6 py-2 border border-white/10 hover:border-neon transition-all duration-500 cursor-none"
              onMouseEnter={() => {
                gsap.to(outlineRef.current, { scale: 1.5, backgroundColor: "rgba(204, 255, 0, 0.1)", borderColor: "#CCFF00" });
              }}
              onMouseLeave={() => {
                gsap.to(outlineRef.current, { scale: 1, backgroundColor: "transparent", borderColor: "#CCFF00" });
              }}
            >
              {/* Efeito de brilho no hover do link */}
              <div className="absolute inset-0 bg-neon opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
              
              <span className="text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-3">
                <svg 
                  className="w-4 h-4 fill-white group-hover:fill-neon transition-colors" 
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                LinkedIn
              </span>
            </a>
          </div>
        </div>

        {/* Linha de Copyright Final */}
        <div className="mt-20 text-center">
          <p className="text-[9px] text-white/10 tracking-[1em] uppercase">
            © 2026 Developed by You // Powered by Next.js
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
    </main>
  );
}