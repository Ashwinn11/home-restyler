const FEATURE_CARDS = [
  {
    title: "Photoreal redesigns",
    description:
      "Generate high-fidelity room transformations from a single photo while preserving structure and proportions.",
  },
  {
    title: "Chat-based refinement",
    description:
      "Iterate naturally with prompts like \"warmer wood tones\" or \"swap pendant lights\" without starting over.",
  },
  {
    title: "4-way variation grid",
    description:
      "Branch your design direction in one click, compare options side-by-side, and continue from your favorite.",
  },
  {
    title: "Palette and mood extraction",
    description:
      "Get curated colors, materials, and style notes you can use for sourcing, briefing, and approvals.",
  },
];

const FAQS = [
  {
    question: "How long does a redesign take?",
    answer:
      "Most generations complete in under a minute. Refinements are typically faster because they build on the current result.",
  },
  {
    question: "Can I change only wall paint?",
    answer:
      "Yes. Switch to Paint mode to isolate wall color updates while preserving room layout and furniture.",
  },
  {
    question: "Can I export results for clients or social posts?",
    answer:
      "Yes. Download generated images at any point and use variation outputs for mood boards, pitch decks, and marketing content.",
  },
];

export default function MarketingLanding() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-warm-gray/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(196,101,58,0.14),transparent_48%),radial-gradient(circle_at_20%_80%,rgba(139,155,126,0.18),transparent_42%)]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 animate-fade-up">
            <p className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-sage-light border border-sage/30 rounded-full px-3 py-1">
              Built for homeowners, designers, and marketers
            </p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-cream">
              Turn one room photo into a fully styled concept in minutes
            </h1>
            <p className="text-base sm:text-lg text-warm-gray-light leading-relaxed max-w-xl">
              Upload a room. Pick a style. Refine by chat. Generate variations.
              Move from blank wall to presentation-ready visuals without design
              bottlenecks.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#app-workspace"
                className="px-6 py-3 min-h-11 inline-flex items-center justify-center bg-terracotta text-cream text-xs uppercase tracking-[0.16em] font-medium hover:bg-terracotta-light transition-colors"
              >
                Launch App
              </a>
              <a
                href="#how-it-works"
                className="px-6 py-3 min-h-11 inline-flex items-center justify-center border border-warm-gray/50 text-cream text-xs uppercase tracking-[0.16em] font-medium hover:border-sage hover:bg-sage/10 transition-colors"
              >
                See Workflow
              </a>
            </div>
          </div>

          <div
            className="grid grid-cols-2 gap-3 sm:gap-4 animate-fade-up"
            style={{ animationDelay: "70ms" }}
          >
            <div className="rounded-xl border border-warm-gray/30 bg-charcoal-light p-4 sm:p-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-warm-gray-light">
                Speed
              </p>
              <p className="font-display text-3xl text-cream mt-2">10x</p>
              <p className="text-xs text-warm-gray-light mt-2 leading-relaxed">
                Faster concept generation compared with manual moodboarding and
                sourcing.
              </p>
            </div>
            <div className="rounded-xl border border-warm-gray/30 bg-charcoal-light p-4 sm:p-5">
              <p className="text-[10px] uppercase tracking-[0.18em] text-warm-gray-light">
                Output
              </p>
              <p className="font-display text-3xl text-cream mt-2">4+</p>
              <p className="text-xs text-warm-gray-light mt-2 leading-relaxed">
                Direction options per run with instant branch-and-compare
                workflow.
              </p>
            </div>
            <div className="rounded-xl border border-warm-gray/30 bg-charcoal-light p-4 sm:p-5 col-span-2">
              <p className="text-[10px] uppercase tracking-[0.18em] text-warm-gray-light">
                Why teams use it
              </p>
              <p className="text-sm text-cream mt-2 leading-relaxed">
                Validate design directions earlier, reduce revision cycles, and
                ship better visual storytelling for listings, campaigns, and
                client approvals.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-14 border-b border-warm-gray/20">
        <div className="flex items-end justify-between gap-4 mb-7">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-terracotta">
              Product Value
            </p>
            <h2 className="font-display text-3xl sm:text-4xl text-cream mt-2">
              A full room restyling workflow
            </h2>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {FEATURE_CARDS.map((feature, i) => (
            <article
              key={feature.title}
              className="rounded-xl border border-warm-gray/30 bg-charcoal-light p-5 sm:p-6 animate-fade-up"
              style={{ animationDelay: `${i * 45}ms` }}
            >
              <h3 className="font-display text-2xl text-cream">
                {feature.title}
              </h3>
              <p className="text-sm text-warm-gray-light leading-relaxed mt-2">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="how-it-works"
        className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-14 border-b border-warm-gray/20"
      >
        <p className="text-[10px] uppercase tracking-[0.2em] text-terracotta">
          How It Works
        </p>
        <h2 className="font-display text-3xl sm:text-4xl text-cream mt-2">
          From photo to polished concept in 3 steps
        </h2>
        <div className="grid md:grid-cols-3 gap-4 mt-7">
          <article className="rounded-xl border border-warm-gray/30 bg-charcoal-light p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-sage-light">
              Step 1
            </p>
            <h3 className="font-display text-2xl text-cream mt-2">Upload</h3>
            <p className="text-sm text-warm-gray-light mt-2">
              Use any room image from your phone or desktop. Layout and
              architecture are retained.
            </p>
          </article>
          <article className="rounded-xl border border-warm-gray/30 bg-charcoal-light p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-sage-light">
              Step 2
            </p>
            <h3 className="font-display text-2xl text-cream mt-2">
              Generate
            </h3>
            <p className="text-sm text-warm-gray-light mt-2">
              Choose a design style or wall paint direction and generate a
              production-grade visualization.
            </p>
          </article>
          <article className="rounded-xl border border-warm-gray/30 bg-charcoal-light p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-sage-light">
              Step 3
            </p>
            <h3 className="font-display text-2xl text-cream mt-2">
              Refine + Export
            </h3>
            <p className="text-sm text-warm-gray-light mt-2">
              Fine-tune with chat, branch variations, and download final assets
              for execution or presentation.
            </p>
          </article>
        </div>
      </section>

      <section className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-14 border-b border-warm-gray/20">
        <p className="text-[10px] uppercase tracking-[0.2em] text-terracotta">
          Common Use Cases
        </p>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <article className="rounded-xl border border-warm-gray/30 bg-charcoal-light p-5">
            <h3 className="font-display text-xl text-cream">
              Interior designers
            </h3>
            <p className="text-sm text-warm-gray-light mt-2">
              Rapidly pre-visualize concepts before committing to sourcing and
              detailed plans.
            </p>
          </article>
          <article className="rounded-xl border border-warm-gray/30 bg-charcoal-light p-5">
            <h3 className="font-display text-xl text-cream">Homeowners</h3>
            <p className="text-sm text-warm-gray-light mt-2">
              Explore style directions confidently before making paint, decor,
              or furniture decisions.
            </p>
          </article>
          <article className="rounded-xl border border-warm-gray/30 bg-charcoal-light p-5">
            <h3 className="font-display text-xl text-cream">
              Marketing teams
            </h3>
            <p className="text-sm text-warm-gray-light mt-2">
              Create high-performing creative variants for property listings,
              ads, and social content.
            </p>
          </article>
        </div>
      </section>

      <section className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-14 border-b border-warm-gray/20">
        <p className="text-[10px] uppercase tracking-[0.2em] text-terracotta">
          FAQ
        </p>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {FAQS.map((faq) => (
            <article
              key={faq.question}
              className="rounded-xl border border-warm-gray/30 bg-charcoal-light p-5"
            >
              <h3 className="text-sm font-semibold text-cream">
                {faq.question}
              </h3>
              <p className="text-sm text-warm-gray-light mt-2 leading-relaxed">
                {faq.answer}
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
