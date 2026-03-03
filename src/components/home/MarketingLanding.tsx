const FEATURE_COLLECTION = [
  {
    num: "01",
    label: "Synthesis",
    title: "Photoreal Transformations",
    text: "Convert an existing room photo into a production-grade visual concept while maintaining every architectural boundary.",
    variant: "wide",
  },
  {
    num: "02",
    label: "Iteration",
    title: "Conversational Fine-Tuning",
    text: "Natural language precision. Refine materials, lighting, and decor with intuitive prompts as the design evolves.",
    variant: "compact",
  },
  {
    num: "03",
    label: "Expansion",
    title: "Branching Iterations",
    text: "Simultaneously explore four distinct design directions to find the perfect aesthetic synergy for your project.",
    variant: "compact",
  },
  {
    num: "04",
    label: "Extraction",
    title: "Curation Mood Boards",
    text: "Automatically distill every design into actionable palettes, materials, and stylistic notes for sourcing.",
    variant: "wide",
  },
];

const FAQS = [
  {
    q: "How does it handle complex lighting?",
    a: "Our AI analysis interprets existing light sources and shadow casting, ensuring generated elements feel physically grounded in the original space.",
  },
  {
    q: "Is the architecture truly preserved?",
    a: "We use structural preservation mapping to honor every window, door, and floor-to-ceiling boundary from your source photo.",
  },
  {
    q: "Can I use it for professional client proofs?",
    a: "Absolutely. The output resolution and stylistic consistency are tuned for initial presentation boards and spatial validation cycles.",
  },
];

export default function MarketingLanding() {
  return (
    <main>
      {/* ═══ THE CINEMATIC HERO: "THE ATELIER" ═══ */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-parchment-faint/10 py-16 px-4">
        {/* Immersive background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.06),transparent_80%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-gold/30 via-gold/5 to-transparent z-0 opacity-40" />
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent z-0 opacity-30" />

        <div className="relative max-w-7xl mx-auto w-full z-10 flex flex-col items-center text-center">
          {/* Top Label */}
          <div className="mb-12 animate-reveal-up overflow-hidden">
            <span className="inline-block text-[10px] uppercase tracking-[0.6em] text-gold font-bold px-6 py-2 border border-gold/20 rounded-full bg-gold/5 backdrop-blur-sm">
              The Next Generation of Spatial Design
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-7xl lg:text-9xl leading-[0.9] sm:leading-[0.85] text-parchment font-medium tracking-tight animate-reveal-up px-2" style={{ animationDelay: '100ms' }}>
            Restyle Any Room, <br />
            <span className="italic font-light text-gold text-[0.85em] mt-1 sm:-mt-2 inline-block">Instantly</span>.
          </h1>

          <div className="mt-8 sm:mt-12 max-w-2xl animate-reveal-up px-4" style={{ animationDelay: '200ms' }}>
            <p className="text-base sm:text-xl text-parchment-muted font-light leading-relaxed">
              Upload a photo of any room and transform it with AI-powered interior design — in seconds.
              <span className="hidden xs:inline"> Choose from 20+ room design styles, visualize new wall paint colors, and download your redesigned space.</span>
            </p>
          </div>

          <div className="mt-10 sm:mt-16 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 animate-reveal-up w-full px-6 sm:px-0" style={{ animationDelay: '300ms' }}>
            <a href="/studio" className="group relative px-8 sm:px-12 py-4 sm:py-5 bg-gold text-ink text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold overflow-hidden transition-all duration-500 hover:shadow-[0_0_50px_rgba(201,168,76,0.3)] text-center">
              <span className="relative z-10">Enter the Studio</span>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-ink group-hover:h-full transition-all duration-300 -z-0 opacity-5" />
            </a>
            <a href="#features" className="px-8 sm:px-12 py-4 sm:py-5 border border-parchment-faint/30 text-parchment text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-semibold hover:border-gold/50 hover:text-gold transition-colors duration-500 text-center">
              Explore Systems
            </a>
          </div>

          {/* Centered Hero Viewfinder: Layered Composition */}
          <div className="mt-20 sm:mt-28 w-full max-w-5xl aspect-[16/9] relative group animate-reveal-up" style={{ animationDelay: '400ms' }}>
            {/* Main Canvas */}
            <div className="absolute inset-0 bg-ink-raised border border-parchment-faint/15 shadow-[0_50px_120px_rgba(0,0,0,0.8)] overflow-hidden">
              <img src="/hero-after.png" alt="AI interior design transformation after result" className="w-full h-full object-cover p-1 sm:p-2 lg:p-4 opacity-90 group-hover:scale-105 transition-transform duration-[4000ms] " />
              {/* Gold Frame Interface */}
              <div className="absolute inset-4 sm:inset-8 border border-gold/15 pointer-events-none group-hover:border-gold/30 transition-colors" />
            </div>

            {/* After unit - Positioned as an exterior margin note */}
            <div className="absolute -top-12 sm:-top-24 left-1/4 sm:left-1/3 z-30 pointer-events-none transition-transform duration-700">
              <div className="bg-gold text-ink px-3 sm:px-4 py-1 sm:py-1.5 text-[8px] sm:text-[10px] font-bold tracking-[0.3em] transform rotate-3 shadow-2xl">
                AFTER
              </div>
              {/* Arrow from exterior tag into image area */}
              <div className="absolute top-4 sm:top-6 left-1/2 w-12 h-12 sm:w-20 sm:h-20">
                <svg viewBox="0 0 100 100" className="w-full h-full text-gold/80 fill-none stroke-current stroke-[2.5] drop-shadow-[0_0_10px_rgba(201,168,76,0.4)]">
                  <path
                    d="M10,10 Q30,40 50,75"
                    className="animate-draw-path"
                    style={{ strokeDasharray: 120, strokeDashoffset: 120, '--dash-length': '120' } as any}
                  />
                </svg>
              </div>
            </div>

            {/* Hand-drawn Path: Before to After */}
            <div className="hidden sm:block absolute left-[5%] bottom-[25%] w-[40%] h-[30%] z-30 pointer-events-none overflow-visible">
              <svg viewBox="0 0 200 100" className="w-full h-full text-gold/60 fill-none stroke-current stroke-[2.5] drop-shadow-[0_0_8px_rgba(201,168,76,0.3)]">
                <path
                  d="M10,80 Q60,10 180,30"
                  className="animate-draw-path"
                  style={{ strokeDasharray: 400, strokeDashoffset: 400, '--dash-length': '400' } as any}
                />
              </svg>
            </div>

            {/* Staggered Source (Before) */}
            <div className="absolute -left-4 sm:-left-16 -bottom-6 sm:bottom-12 w-1/3 aspect-square bg-parchment p-1.5 sm:p-3 shadow-2xl skew-y-3 -rotate-6 transition-all duration-700 hover:rotate-0 hover:skew-y-0 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] z-40">
              {/* Before Unit */}
              <div className="absolute -top-12 sm:-top-20 -left-6 sm:-left-12 z-50 pointer-events-none">
                <div className="bg-gold text-ink px-2 sm:px-3 py-1 text-[8px] sm:text-[10px] font-bold tracking-[0.2em] transform -rotate-3">BEFORE</div>
                <div className="hidden sm:block absolute top-4 left-10 w-16 h-16">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-gold/80 fill-none stroke-current stroke-[2.5]">
                    <path
                      d="M10,10 Q30,40 50,60"
                      className="animate-draw-path"
                      style={{ strokeDasharray: 100, strokeDashoffset: 100, '--dash-length': '100' } as any}
                    />
                  </svg>
                </div>
              </div>
              <div className="relative w-full h-full overflow-hidden bg-ink">
                <img src="/hero-before.png" alt="Original room photo before AI redesign" className="w-full h-full object-cover opacity-85" />
              </div>
              <div className="pt-4 text-center">
                <p className="font-display text-[10px] text-ink/40 tracking-[0.4em] uppercase font-bold">RAW__IMG_SOURCE</p>
              </div>
            </div>

            {/* Floating Certification Mark */}
            <div className="absolute -top-10 -right-4 w-32 h-32 border border-gold/20 rounded-full flex items-center justify-center p-4 bg-ink backdrop-blur-sm z-20 animate-spin-slow group-hover:border-gold/50">
              <p className="text-[7px] uppercase tracking-[0.3em] text-gold/60 text-center font-bold">
                Atelier Certified <br className="my-1" /> Photoreal Pipeline
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ THE "EXHIBITION" FEATURES ═══ */}
      <section id="features" className="py-24 sm:py-40 bg-ink relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gold/5' to-transparent opacity-20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 sm:mb-28 gap-8 sm:gap-12">
            <div className="flex-1 animate-reveal-up">
              <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold mb-6 block">Capabilities</span>
              <h2 className="font-display text-4xl sm:text-6xl lg:text-8xl text-parchment leading-[0.9] font-medium tracking-tight">
                Designed for <br />
                <span className="italic font-light italic">Iteration</span>.
              </h2>
            </div>
            <div className="animate-reveal-up" style={{ animationDelay: '100ms' }}>
              <p className="text-lg sm:text-xl text-parchment-muted font-light max-w-sm leading-relaxed border-l border-gold/30 pl-6 sm:pl-8">
                Moving beyond prompt engineering. We built a visual pipeline for precision spatial validation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
            {FEATURE_COLLECTION.map((item, i) => (
              <div
                key={item.num}
                className={`relative border border-parchment-faint/15 bg-ink-raised rounded-lg p-6 sm:p-10 group overflow-hidden animate-reveal-up hover:border-gold/40 transition-all duration-700 ${item.variant === 'wide' ? 'md:col-span-12 lg:col-span-8' : 'md:col-span-6 lg:col-span-4'
                  }`}
                style={{ animationDelay: `${i * 150}ms` }}
              >
                {/* Background Detail */}
                <span className="font-display text-8xl sm:text-[120px] absolute -top-8 -right-4 sm:-top-12 sm:-right-4 text-gold/5 font-bold group-hover:text-gold/10 transition-colors duration-700 pointer-events-none">
                  {item.num}
                </span>

                <div className="relative z-10 flex flex-col h-full justify-between gap-6 sm:gap-8">
                  <div className="space-y-3 sm:space-y-4">
                    <p className="text-[10px] uppercase tracking-[0.4em] text-gold/60 font-bold group-hover:text-gold transition-colors">{item.label}</p>
                    <h3 className="font-display text-2xl sm:text-4xl text-parchment font-medium group-hover:translate-x-2 transition-transform duration-500">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-parchment-muted leading-relaxed font-light max-w-md group-hover:text-parchment transition-colors duration-500">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ THE WORKFLOW SPREAD ═══ */}
      <section className="py-16 sm:py-24 bg-ink-raised border-y border-parchment-faint/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="font-display text-3xl sm:text-5xl text-parchment font-medium italic animate-reveal-up">Inside the Workflow</h2>
            <div className="w-16 sm:w-20 h-px bg-gold mx-auto mt-4 animate-reveal-up" style={{ animationDelay: '100ms' }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { title: "Sourcing", text: "Direct spatial analysis from raw photography. Any room, any lighting, any quality.", icon: "01" },
              { title: "Synthesis", text: "Atelier AI fuses your direction with architectural logic for the perfect render.", icon: "02" },
              { title: "Refining", text: "Iterative conversational loops. Dial in material textures and accent finishes.", icon: "03" },
              { title: "Finalizing", text: "High-resolution export and mood board extraction for professional presentation.", icon: "04" }
            ].map((step, i) => (
              <div
                key={step.title}
                className="relative group animate-reveal-up"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                {/* Connector line for desktop */}
                {i < 3 && <div className="hidden lg:block absolute top-10 right-0 w-full h-px bg-parchment-faint/20 group-hover:bg-gold/30 transition-colors -z-0" />}

                <div className="relative z-10 p-2 hover:translate-y-[-4px] transition-transform duration-500">
                  <div className="w-12 h-12 bg-ink border border-gold/20 flex items-center justify-center mb-6 transition-all duration-500 group-hover:border-gold/60 group-hover:shadow-[0_0_20px_rgba(201,168,76,0.15)] group-hover:rotate-45">
                    <span className="font-display text-xl text-gold/40 group-hover:text-gold group-hover:-rotate-45 transition-all">{step.icon}</span>
                  </div>
                  <h3 className="font-display text-xl text-parchment font-medium mb-3">{step.title}</h3>
                  <p className="text-xs text-parchment-muted font-light leading-relaxed group-hover:text-parchment-muted/80">
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ & CLOSE: THE ARCHITECTURAL SPLIT ═══ */}
      <section className="py-16 sm:py-24 border-b border-parchment-faint/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:grid lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-5 mb-16 lg:mb-0 animate-reveal-up">
            <span className="text-[10px] uppercase tracking-[0.5em] text-gold font-bold mb-6 block">Common Questions</span>
            <h2 className="font-display text-4xl sm:text-6xl text-parchment font-medium leading-[0.9] tracking-tight mb-10">
              Frequently <br /> <span className="text-gold italic">Asked Questions</span>.
            </h2>
            <div className="p-8 border border-gold/20 bg-gold/5 backdrop-blur-md rounded-lg max-w-sm group hover:border-gold/40 transition-all duration-500">
              <p className="font-display text-xl text-parchment font-medium italic mb-5">Ready to restyle your world?</p>
              <a href="/studio" className="inline-flex items-center gap-4 text-[11px] uppercase tracking-[0.3em] font-bold text-gold group-hover:text-gold-soft transition-colors">
                Open The Studio
                <svg className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6 sm:space-y-8 animate-reveal-up" style={{ animationDelay: '200ms' }}>
            {FAQS.map((faq, i) => (
              <div key={faq.q} className="group border border-parchment-faint/10 p-6 sm:p-8 bg-ink-raised hover:border-gold/30 hover:bg-ink-elevated transition-all duration-500 rounded-lg">
                <h3 className="font-display text-xl sm:text-2xl text-parchment font-medium mb-3 leading-tight group-hover:text-gold transition-colors">{faq.q}</h3>
                <p className="text-sm sm:text-base text-parchment-muted font-light leading-relaxed group-hover:text-parchment/80 transition-colors duration-500">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Styles for this page */}
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </main>
  );
}
