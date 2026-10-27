import type { Article, Author, Category, SiteSettings } from "./types";

/**
 * Seed content for SIGNAL.
 *
 * This file is the source of truth for the build: the Vite SEO plugin reads it
 * to generate sitemap.xml and rss.xml. The admin area edits a copy held in the
 * browser; use "Export content" there to write changes back into this file.
 *
 * The articles below are sample editorial copy written for this template.
 */

export const site: SiteSettings = {
  name: "SIGNAL",
  tagline: "Technology, reported closely",
  description:
    "A technology magazine covering silicon, software, energy, security and the people building them.",
  url: "https://signal.press",
  locale: "en",
  founded: "2021",
};

export const categories: Category[] = [
  {
    slug: "silicon",
    name: "Silicon",
    description: "Process nodes, packaging, foundries and the physics underneath.",
    hue: 22,
  },
  {
    slug: "machines",
    name: "Machines",
    description: "Model architecture, training economics and what deployment actually costs.",
    hue: 268,
  },
  {
    slug: "software",
    name: "Software",
    description: "Languages, runtimes, developer tools and the craft of shipping.",
    hue: 196,
  },
  {
    slug: "security",
    name: "Security",
    description: "Memory safety, cryptography, supply chains and incident reporting.",
    hue: 148,
  },
  {
    slug: "energy",
    name: "Energy",
    description: "Grids, cooling, storage and the power bill behind every datacenter.",
    hue: 68,
  },
  {
    slug: "policy",
    name: "Policy",
    description: "Regulation, standards bodies, procurement and the law catching up.",
    hue: 318,
  },
];

export const authors: Author[] = [
  {
    slug: "mara-oyelaran",
    name: "Mara Oyelaran",
    role: "Silicon correspondent",
    bio: "Mara covers semiconductor manufacturing and the long supply chain behind it. She spent six years as a process engineer before moving to reporting.",
    location: "Hsinchu",
    hue: 22,
    links: { x: "#", site: "#", email: "mara@signal.press" },
  },
  {
    slug: "jonas-brandt",
    name: "Jonas Brandt",
    role: "Senior editor, Machines",
    bio: "Jonas writes about the economics of machine learning: what a model costs to train, to serve, and to be wrong.",
    location: "Berlin",
    hue: 268,
    links: { x: "#", github: "#", email: "jonas@signal.press" },
  },
  {
    slug: "priya-raghunath",
    name: "Priya Raghunath",
    role: "Software editor",
    bio: "Priya reports on languages, runtimes and the tools developers argue about. Previously a compiler engineer.",
    location: "Bengaluru",
    hue: 196,
    links: { github: "#", site: "#", email: "priya@signal.press" },
  },
  {
    slug: "tom-vasquez",
    name: "Tom Vasquez",
    role: "Security correspondent",
    bio: "Tom covers vulnerability research, incident response and the slow work of making old code safe.",
    location: "Chicago",
    hue: 148,
    links: { x: "#", github: "#", email: "tom@signal.press" },
  },
  {
    slug: "ingrid-halvorsen",
    name: "Ingrid Halvorsen",
    role: "Energy & policy",
    bio: "Ingrid follows interconnection queues, cooling water and the regulation shaping where compute gets built.",
    location: "Oslo",
    hue: 68,
    links: { site: "#", email: "ingrid@signal.press" },
  },
];

export const articles: Article[] = [
  {
    slug: "the-last-easy-node",
    title: "The last easy node",
    standfirst:
      "Shrinking transistors used to be a schedule problem. Now it is a chemistry problem, a metrology problem, and an argument about who pays for the next factory.",
    category: "silicon",
    author: "mara-oyelaran",
    publishedAt: "2026-10-21",
    status: "published",
    featured: true,
    tags: ["foundry", "lithography", "manufacturing"],
    seo: {
      description:
        "Why each new semiconductor process node costs more and delivers less, and what the industry is doing about it.",
    },
    body: `For thirty years the semiconductor industry ran on a promise that was close enough to a law. Transistors got smaller on a schedule, and because they got smaller they also got cheaper, faster and less power-hungry at the same time. A chip designer could plan a product around a node that did not exist yet and be confident it would arrive.

That bundle has come apart. Smaller still happens. Cheaper mostly does not.

## Where the cost went

The visible cost is the equipment. An extreme ultraviolet scanner is the most complicated machine ever sold as a product, and the newer high-numerical-aperture tools are larger, heavier and more expensive than the generation before. But the tool price is the part everyone quotes because it is the part that has a number attached.

The invisible cost is everything the tool requires around it. Each additional patterning step adds inspection. Each inspection adds metrology tools, and metrology at these dimensions is itself a research problem: you are trying to measure a feature that is smaller than the wavelength you would like to measure it with. Yield learning, which used to be a matter of months, now consumes a meaningful fraction of a node's commercial life.

> A node is no longer a product you buy. It is a relationship you enter, and the terms are set before the first wafer moves.

## The design side of the bill

Design costs have followed the same curve. A full mask set is one line item. The verification work behind it is a larger one, and it scales with the number of rules the foundry hands you. Restrictive design rules were introduced to make lithography tractable; they also narrowed what a designer is allowed to express.

The consequence is consolidation. The number of companies that can afford a leading-edge tapeout keeps falling, and the ones that remain are concentrated in a few product categories where the economics still close: datacenter accelerators, flagship mobile, and the networking silicon that connects them.

### What everyone else does instead

- Stay on a mature node and optimise the design, which is where most automotive and industrial silicon lives.
- Buy performance through packaging rather than through lithography.
- Specialise hard enough that a smaller transistor budget still wins on the specific workload.

That third option is the interesting one. A general-purpose core has to be good at code nobody has written yet. A domain-specific block only has to be good at one thing, and that constraint buys back a great deal of area and power.

## Packaging as the pressure valve

If you cannot make the transistor cheaper, make the system denser. Advanced packaging moves the hard problem from the lithography cell to the assembly line: stacking dies, putting memory next to logic instead of across a board, and connecting the pieces with interconnect that behaves more like on-die wiring than like a circuit board trace.

This is not free either. Thermal density gets worse, test gets harder, and a known-good-die problem becomes a known-good-stack problem. But the capital intensity is different in kind, and it can be deployed incrementally.

## The argument underneath

Every conversation about the next node eventually becomes a conversation about who underwrites it. Foundries want commitments before construction. Customers want prices before commitments. Governments want factories inside their borders and are willing to pay part of the difference, which changes where plants are built without changing what they cost to run.

None of that restores the old bundle. The useful question is not when the curve resumes. It is which parts of a system still benefit from the leading edge, and which parts were only there because the leading edge used to be the cheapest place to put them.`,
  },
  {
    slug: "what-small-models-learned",
    title: "What the small models learned from the large ones",
    standfirst:
      "Distillation turned a research curiosity into the default deployment strategy. The interesting part is what gets lost on the way down.",
    category: "machines",
    author: "jonas-brandt",
    publishedAt: "2026-10-16",
    status: "published",
    featured: true,
    tags: ["distillation", "inference", "deployment"],
    body: `The production story of the last two years is not a larger model. It is a smaller one that behaves almost as well on the tasks a company actually ships, and costs an order of magnitude less to serve.

Distillation is the mechanism. Train a large model, use it to generate supervision, and train a smaller model against that supervision rather than against raw data. The student sees a cleaner, denser signal than the original corpus offers, and it converges on behaviour that the teacher spent far more compute to discover.

## The economics are not subtle

Serving cost scales with parameters activated per token, and most production traffic is repetitive. Support triage, classification, extraction, routing and summarisation are a large share of the volume, and none of them need the full capability surface of a frontier model.

Once that is obvious, the deployment pattern follows: route the easy majority to a small model, escalate the rest. The hard engineering is in the router, not the models.

\`\`\`python
def route(request):
    draft = small.generate(request)
    if draft.confidence > THRESHOLD:
        return draft
    return large.generate(request, hint=draft)
\`\`\`

## What does not survive the shrink

Benchmarks flatter distilled models because benchmarks ask questions whose answers are in the training distribution. The gaps show up elsewhere.

1. **Long-horizon consistency.** Small models drift on multi-step tasks, and the drift compounds in exactly the agentic settings people want to use them for.
2. **Rare knowledge.** Facts that appeared a handful of times in the corpus survive in a large model and quietly vanish in a small one.
3. **Calibration.** A distilled model often keeps the teacher's confidence while losing the teacher's competence, which is the worst combination for a router that reads confidence.

> The student learns the teacher's answers. It does not always learn the teacher's reasons, and the reasons are what generalise.

## The evaluation problem this creates

If the distilled model is trained on teacher output, and the evaluation set is also scored by a teacher-class model, the loop closes in a way that hides failure. Teams that catch this early tend to do two things: hold out a human-labelled set that never touches a model, and track per-segment regressions rather than aggregate scores.

Aggregate scores are how a model gets worse at your least common, most expensive query type without anyone noticing for a quarter.

## Where this goes

The frontier keeps mattering, but increasingly as a factory rather than as a product. It generates the supervision, sets the ceiling, and handles the escalations. The thing in the request path is small, specialised, and replaced more often than anyone outside the team realises.`,
  },
  {
    slug: "the-grid-is-the-bottleneck",
    title: "The grid is the bottleneck",
    standfirst:
      "Chips are available. Land is available. Interconnection is not, and the queue is now the single longest line item in a datacenter schedule.",
    category: "energy",
    author: "ingrid-halvorsen",
    publishedAt: "2026-10-09",
    status: "published",
    featured: true,
    tags: ["grid", "datacenter", "interconnection"],
    body: `Ask an operator what delays a new datacenter and the answer used to be equipment. Now it is a connection agreement.

Interconnection queues exist because the grid is a shared machine. Adding a large load changes the flows on lines that other people depend on, so the utility studies the effect before agreeing to it. Those studies are sequential, interdependent, and in many regions badly backlogged. A project that withdraws can force restudy of everything behind it.

## Why the queue grew

Three things arrived at once: a wave of renewable generation that wants to connect, a wave of large flexible loads that want to connect, and transmission build rates that have not moved much in either case. The study process was designed for a smaller number of larger, slower projects.

The result is a market where the scarce asset is not power generation but the right to draw power at a specific point on a specific wire.

## What operators are doing about it

- **Bring the generation.** On-site or contracted-adjacent generation reduces the size of the grid request, sometimes enough to change which queue you are in.
- **Promise flexibility.** A load that can curtail on demand is a different object to a planner than a load that cannot, and some regions now price that difference explicitly.
- **Go where the wire already is.** Retired thermal plants come with interconnection capacity, substations and, often, water rights.

That last pattern explains a surprising share of recent siting decisions. The attraction is not the land. It is the paperwork that already exists.

> The cheapest megawatt is the one somebody already connected.

## Cooling is a water question

Power is the headline constraint; water is the local one. Evaporative cooling is efficient and thirsty. Closed-loop and air-cooled designs use far less water and more electricity, which moves the problem back onto the grid.

Direct liquid cooling changes the arithmetic again. Higher rack densities make heat recovery practical, and a datacenter that can deliver warm water at a useful temperature becomes an asset to a district heating network rather than an argument with one.

## The regulatory piece

Reform efforts have focused on batching studies, charging deposits that make speculative applications expensive, and giving planners the authority to approve transmission that serves a region rather than a single customer. These are unglamorous changes and they are the ones that move the schedule.

Nothing here is solved by better chips. The constraint sits in a process that predates the industry asking it for favours.`,
  },
  {
    slug: "memory-safety-arrives-late",
    title: "Memory safety arrives late, and all at once",
    standfirst:
      "A decade of slow argument ended in two years of fast adoption. The remaining work is in the code nobody wants to touch.",
    category: "security",
    author: "tom-vasquez",
    publishedAt: "2026-10-02",
    status: "published",
    tags: ["rust", "memory-safety", "cve"],
    body: `The case for memory-safe languages was made and remade for twenty years before anything moved. What changed was not the argument. It was that the people writing procurement requirements started reading it.

## The shape of the problem

A large share of severe vulnerabilities in large C and C++ codebases come from the same handful of mistakes: use after free, out-of-bounds access, type confusion, integer overflow feeding an allocation. These are not exotic. They are the standard failure modes of manual memory management under deadline.

Static analysis caught some. Sanitizers caught more, at the cost of running them. Neither changed the fact that the language permits the mistake and the compiler cannot see it.

## Why adoption finally happened

Three forces converged:

1. **Toolchain maturity.** Cross-compilation, embedded targets and build system integration stopped being research projects.
2. **Interop that works.** The realistic migration is never a rewrite. It is a new module in a safe language, called across a stable boundary from an old one.
3. **External pressure.** Security advisories and procurement guidance began naming memory safety specifically, which turned an engineering preference into a compliance line item.

> Nobody rewrites a million lines. They stop adding to it, and they wrap the parts that keep bleeding.

## The parts that stay

Kernels, firmware, codecs and parsers are the usual targets for migration, and parsers are the most tractable: they sit at a trust boundary, they are self-contained, and they are where the bugs are.

What stays in unsafe code is the awkward middle: large legacy systems with no test coverage, vendor binaries with no source, and hardware interfaces where the safe abstraction has to be written by hand anyway. For those, the realistic strategy is containment. Reduce privilege, isolate the process, fuzz continuously, and assume the component will fail.

### Unsafe is not a loophole

Every safe language has an escape hatch, and the escape hatch is where the interesting vulnerabilities will live. The discipline that matters is keeping those blocks small, auditable, and wrapped in an interface that cannot be misused from outside.

Teams that treat the escape hatch as ordinary code end up with the old failure modes in a new syntax, plus the false confidence that comes from the language name on the file.

## What to watch

The next phase is hardware-assisted: memory tagging, pointer authentication and capability hardware that catch the mistake at runtime in code that was never going to be rewritten. It is slower than prevention and far cheaper than migration, which makes it the most likely thing to actually ship at scale.`,
  },
  {
    slug: "end-of-the-framework-decade",
    title: "The end of the framework decade",
    standfirst:
      "Web development spent ten years moving work from the server to the browser. It has spent the last three moving most of it back.",
    category: "software",
    author: "priya-raghunath",
    publishedAt: "2026-09-24",
    status: "published",
    tags: ["web", "frameworks", "rendering"],
    body: `The single-page application solved a real problem. Page loads were slow, interactions were janky, and moving state into the client made applications feel like applications.

Then the bill arrived: bundle size, hydration cost, duplicated routing, duplicated validation, and a generation of sites that shipped a megabyte of JavaScript to render an article.

## The correction

The current generation of frameworks all converge on the same posture. Render on the server by default. Ship JavaScript only for the parts that need it. Treat interactivity as something you opt into per component rather than something the whole page inherits.

The names differ. The idea does not: HTML first, hydration as an exception.

\`\`\`html
<article>
  <!-- static, zero JS -->
  <h1>The end of the framework decade</h1>
  <comment-thread client:visible></comment-thread>
</article>
\`\`\`

## What it costs

Server rendering moves work to a machine you pay for, and that machine now needs to be close to the user to be fast. Edge runtimes answer that and introduce their own constraints: limited APIs, cold starts, and a split between code that can run anywhere and code that needs a real database connection.

The second cost is conceptual. A component that runs in two places with different capabilities is harder to reason about than one that runs in one place, and most of the sharp edges in modern frameworks live exactly on that boundary.

> We did not simplify the model. We moved the complexity to a place where the user does not pay for it.

## The part that actually improved

Build tooling. Native-speed bundlers turned a two-minute rebuild into a sub-second one, and that single change did more for day-to-day development than any rendering architecture.

Typed end-to-end data flow is the other durable win: a schema that validates at the boundary and generates types on both sides eliminates a whole category of integration bug that used to be caught by users.

## What comes next

Probably less. The interesting work is consolidation, not invention: fewer concepts, better defaults, and primitives stable enough that the documentation stays true for more than a release cycle.

A decade of churn produced genuinely better tools. It also produced an industry reflex to rewrite rather than maintain, and that reflex is the expensive part.`,
  },
  {
    slug: "writing-rules-for-a-machine-that-writes-back",
    title: "Writing rules for a machine that writes back",
    standfirst:
      "Regulators have settled on a risk-tiered approach. Implementation now depends on definitions that engineers and lawyers read differently.",
    category: "policy",
    author: "ingrid-halvorsen",
    publishedAt: "2026-09-18",
    status: "published",
    tags: ["regulation", "compliance", "governance"],
    body: `Most jurisdictions have converged on the same structure: classify systems by risk, impose obligations proportional to the tier, and require documentation that lets an auditor reconstruct what the system was supposed to do.

The structure is reasonable. The friction is in the definitions.

## Where the definitions bind

A rule that applies to a "system placed on the market" has to say something about a model that is fine-tuned by a customer, deployed by an integrator and used by an employee. Each of those parties can plausibly claim the obligations belong to someone else, and the text has to allocate them.

The same applies to "substantial modification". If fine-tuning counts, a great deal of ordinary product work triggers a fresh conformity assessment. If it does not, the assessment describes a system nobody is running.

## What compliance looks like in practice

- **Provenance.** What data trained the model, under what licence, and can you show it.
- **Evaluation records.** Not a score, a reproducible procedure with versioned inputs.
- **Incident reporting.** A defined threshold and a clock, which means detection has to be instrumented before the clock starts.
- **Human oversight.** Documented authority to override, and evidence that the override is usable rather than theoretical.

> The documentation burden is the regulation. Everything else follows from being able to answer questions about a system a year after you shipped it.

## The open-weights question

Rules written for a product do not map cleanly to a file anyone can download. Most frameworks carve out exemptions for freely released models, then narrow them for the largest systems, which leaves a threshold that is defined by compute and therefore ages badly.

The practical effect is a compliance cliff at a size that is already being crossed by organisations without a compliance function.

## Advice that survives the next draft

Treat the documentation as engineering output, not legal output. Version the evaluations. Log the overrides. Keep a record of what data entered the system and under what terms.

Teams that do this are mostly compliant by accident, in any jurisdiction. Teams that treat it as a filing exercise will do the work twice.`,
  },
  {
    slug: "packaging-is-the-new-node",
    title: "Packaging is the new process node",
    standfirst:
      "When lithography stops delivering, the gains move to how dies are stacked, connected and cooled.",
    category: "silicon",
    author: "mara-oyelaran",
    publishedAt: "2026-09-11",
    status: "published",
    tags: ["packaging", "chiplets", "interconnect"],
    body: `A chiplet strategy starts as a yield argument. A large die has a higher chance of containing a defect, so splitting it into smaller dies and assembling them raises the number of usable parts per wafer. That argument alone justified the first generation.

The second generation is about mixing. Logic on a leading-edge node, analog and I/O on a mature one, memory stacked directly above the compute that consumes it. Each die sits on the process that suits it, which is a better fit to how the underlying physics has diverged.

## The interconnect is the product

What makes this work is the link between dies. On-package interconnect has to approach on-die bandwidth and energy per bit, or the partitioning costs more than it saves. That requirement is what drives the move from organic substrates to silicon interposers and direct bonding.

### Three things get harder

1. **Thermals.** Stacking puts heat sources on top of each other and buries the hottest one furthest from the heatsink.
2. **Test.** A defective die discovered after bonding takes the good ones with it, which makes known-good-die testing economically load-bearing.
3. **Standards.** Mixing dies across vendors requires agreement on the electrical and protocol layers, and the industry is partway there.

> Integration moved from the wafer to the package, and so did the hard part of the schedule.

## Who it favours

Companies with high-volume products and in-house packaging expertise. The capital is different from a fab, but it is not small, and the learning curve is steep in a way that does not transfer from board-level assembly.

The open question is whether a genuine chiplet marketplace emerges, where a designer buys an I/O die from one vendor and an accelerator from another. The standards exist on paper. The business arrangements, mostly, do not.`,
  },
  {
    slug: "inference-at-the-edge-of-the-budget",
    title: "Inference at the edge of the budget",
    standfirst:
      "Serving a model is a scheduling problem wearing a machine learning costume. The wins come from batching, caching and admitting when to say no.",
    category: "machines",
    author: "jonas-brandt",
    publishedAt: "2026-09-03",
    status: "published",
    tags: ["inference", "serving", "latency"],
    body: `Training gets the headlines. Serving gets the invoice.

The structure of the problem is familiar to anyone who has run a database: you have expensive hardware, a stream of heterogeneous requests, and a latency target that only matters at the tail. Everything useful comes from scheduling.

## The three levers

**Batching.** Accelerators are throughput machines; a batch of one wastes most of the silicon. Continuous batching, where new requests join an in-flight batch rather than waiting for the next one, is the single largest practical win.

**Caching.** Shared prefixes are everywhere in production traffic: system prompts, document context, few-shot examples. Caching the attention state for a prefix turns repeated work into a lookup.

**Quantisation.** Lower-precision weights reduce memory traffic, which is usually the binding constraint. The quality loss is workload-specific and needs measuring on your traffic, not on a benchmark.

\`\`\`
tokens/sec  = f(batch size, sequence length, memory bandwidth)
cost/token  = accelerator $/hour ÷ tokens/sec
\`\`\`

The second line is the one finance cares about, and it is dominated by utilisation, not by model choice.

## The tail

Long sequences occupy memory for a long time, and memory is what limits batch size. One pathological request can degrade latency for everything scheduled alongside it. Production systems need admission control: limits on sequence length, preemption for runaway generations, and a queue that degrades predictably instead of collapsing.

> Capacity planning for inference is capacity planning for the worst request you will accept, not the average one you expect.

## What to measure

Time to first token and inter-token latency, separately, at the ninety-ninth percentile, segmented by request shape. Aggregate throughput hides the behaviour users complain about.`,
  },
  {
    slug: "the-dependency-nobody-owns",
    title: "The dependency nobody owns",
    standfirst:
      "Critical infrastructure keeps turning out to be a package maintained by one person in their spare time. Funding has improved. Governance has not.",
    category: "security",
    author: "tom-vasquez",
    publishedAt: "2026-08-26",
    status: "published",
    tags: ["open-source", "supply-chain", "maintenance"],
    body: `Every few years an incident makes the same point: a widely deployed system depends on a component that almost nobody is paid to maintain, and the gap between its importance and its support is enormous.

The response has improved. Foundations fund maintainers, large vendors sponsor critical projects, and bills of materials make the dependency graph visible to the people who own the risk.

What has not improved is governance. Funding a maintainer does not answer who decides when a project should be archived, who holds the signing keys, or what happens when the one person with commit access stops responding to email.

## Three failure modes

1. **Abandonment.** The package still installs. Nobody has reviewed a line of it in four years.
2. **Transfer.** Maintainer burnout leads to handing over publishing rights to a volunteer nobody vetted.
3. **Silent divergence.** The repository and the published artifact stop matching, and no one checks because nothing visible breaks.

The third is the one that scales, because it attacks the build rather than the source. Reproducible builds are the structural answer and remain unevenly adopted outside a few ecosystems.

> A signature proves who published an artifact. It does not prove what the artifact does.

## What organisations can actually do

Generate a bill of materials and look at it. Pin versions and review upgrades rather than taking them automatically. Vendor the handful of dependencies you genuinely cannot afford to have change under you. Pay the maintainers of the ones you depend on most, in money, not in issues.

And accept the asymmetry: the effort required to maintain a package is continuous, and the effort required to consume it is a single line in a manifest. Every supply chain problem is downstream of that imbalance.`,
  },
  {
    slug: "datacenter-heat-reused",
    title: "Datacenter heat, reused",
    standfirst:
      "Liquid cooling makes waste heat valuable enough to sell. A handful of cities have already built the pipes.",
    category: "energy",
    author: "ingrid-halvorsen",
    publishedAt: "2026-08-14",
    status: "published",
    tags: ["cooling", "district-heating", "efficiency"],
    body: `Air-cooled datacenters produce a large quantity of slightly warm air, which is thermodynamically useless. Nobody wants to buy it, and upgrading it with heat pumps costs more than it returns.

Direct liquid cooling changes the output. Water leaving a rack at a usefully high temperature can enter a district heating network with little or no upgrade, and at that point the waste stream becomes a product.

## Why it only works in some places

District heating networks are the constraint. They exist in northern Europe and a handful of other regions because of decades of municipal investment, and they cannot be retrofitted into a city quickly or cheaply.

Where the network exists, the arrangement is straightforward: the operator sells heat, the utility buys it, and the datacenter's local political position improves considerably. Where it does not, the heat still has to go somewhere, and the options are dry coolers and electricity.

## The density argument

Liquid cooling is being adopted mostly for a different reason: accelerator racks have passed the point where air can remove the heat at any reasonable airflow. Heat reuse is a side effect of a decision made on thermal grounds.

That matters because it means the supply of reusable heat is growing regardless of whether anyone has built a pipe to take it.

> The efficiency metric everyone quotes measures how much power the building wastes. It says nothing about whether the heat does anything useful afterwards.

## What to watch

Standardised interfaces between facility water loops and municipal networks, and contracts that let a heat buyer rely on supply from a facility whose compute load varies hourly. The engineering is solved. The commercial terms are the slow part.`,
  },
  {
    slug: "local-first-finally-practical",
    title: "Local-first, finally practical",
    standfirst:
      "Sync engines turned a research idea into a library you can install. The hard part was never the merge algorithm.",
    category: "software",
    author: "priya-raghunath",
    publishedAt: "2026-07-30",
    status: "published",
    tags: ["crdt", "sync", "offline"],
    body: `The local-first argument is simple. Keep the authoritative copy of a user's data on their device, sync it when a network is available, and the application stays fast and usable regardless of connectivity.

The reason it took so long is not conflict resolution. Convergent data types have worked for years. The reason is everything around them: authentication, access control, schema migration and storage limits on devices you do not control.

## What the current generation got right

Sync engines now ship as a database with replication rather than as a merge algorithm with homework. The developer writes queries against a local store; the engine handles the transport, the server-side persistence and the subscription that keeps a view live.

\`\`\`ts
const todos = db.query("select * from todos where done = false");
// updates locally, syncs in the background, resolves conflicts on merge
\`\`\`

That is the entire ergonomic change, and it is the one that moved adoption.

## The parts still unsolved

- **Permissions.** A client that holds the data cannot be trusted to filter it, so the server still needs a model of who may see which rows.
- **Migrations.** Clients that have been offline for months arrive with an old schema and expect to merge.
- **Deletion.** Tombstones accumulate, and "delete everything about this user" is hard when copies are by design everywhere.

> Local-first makes reading fast and makes forgetting hard.

## Where it fits

Document editors, design tools, note-taking, field data collection, anything used on a train. It fits badly where data is shared broadly, where access rules change frequently, or where the authoritative answer must be a single server's opinion at a single instant.

Which is to say: it is a good default for applications about a person's own work, and a poor one for a ledger.`,
  },
  {
    slug: "the-repair-right-three-years-in",
    title: "The repair right, three years in",
    standfirst:
      "Parts are available. Manuals are available. Pairing requirements have quietly absorbed most of the gain.",
    category: "policy",
    author: "tom-vasquez",
    publishedAt: "2026-07-15",
    status: "draft",
    tags: ["right-to-repair", "hardware", "consumer"],
    body: `Repair legislation has produced visible compliance. Manufacturers publish service manuals, sell parts to independent shops, and provide the diagnostic software that used to be restricted to authorised channels.

The outcome in the repair shop is less clear.

## Pairing

Many components authenticate to the device. A replacement part that is genuine and correctly installed can still produce a warning, a disabled feature or a degraded mode until it is paired with software the manufacturer controls.

Security arguments for this are real for a narrow set of components: biometric sensors and secure elements have a genuine need to be bound to a device. The arguments stretch considerably when applied to a battery or a display.

## What the laws address

Most texts cover availability, price and documentation. Fewer address software locks, and those that do tend to use language general enough that compliance can be argued either way.

> A part you can buy and cannot enable is not a repairable part. It is a receipt.

## What would change the outcome

A requirement that any function available before a repair remains available after one, with a narrow exception for components with a documented security role. That shifts the argument from access to outcome, which is harder to satisfy on paper alone.

*This piece is in draft pending responses from three manufacturers.*`,
  },
  {
    slug: "the-interview-protocol",
    title: "The interview that does not predict anything",
    standfirst:
      "Hiring pipelines keep measuring what is easy to measure. A few teams have started measuring the work instead.",
    category: "software",
    author: "priya-raghunath",
    publishedAt: "2026-06-28",
    status: "draft",
    tags: ["hiring", "teams", "practice"],
    body: `The standard technical interview measures performance under time pressure on a problem with a known answer, observed by a stranger. Very little production work has those properties.

## What replaced it where it was replaced

Work-sample tasks drawn from the actual codebase, scoped to a couple of hours and paid. Debugging sessions on a real failure with real logs. Code review of a pull request with deliberate problems in it, which tests judgement rather than recall.

Each of these is more expensive to run and harder to standardise, which is why adoption tracks how badly a team needs the signal rather than how good the signal is.

## The measurement problem

Nobody has a clean comparison. Teams that change their process also change their sourcing, their levels and their onboarding, and the outcome measure is a performance review written by people who knew which process hired whom.

> We do not have evidence that the new interview is better. We have evidence that candidates stop withdrawing.

That is not nothing. In a market where good candidates have options, the process that loses fewer of them wins on volume even if its signal is identical.`,
  },
];

export const seed = { site, categories, authors, articles };
