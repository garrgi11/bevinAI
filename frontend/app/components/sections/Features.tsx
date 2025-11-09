import { GitPullRequest, ShieldCheck, Workflow, NotebookPen } from "lucide-react"

const features = [
  {
    title: "Clear PRDs, instantly",
    description: "Drafts product briefs and PRDs with goals, UX flows, edge cases, and acceptance criteria.",
    icon: NotebookPen,
  },
  {
    title: "Roadmaps that adapt",
    description: "Turns strategy into roadmaps, reprioritizes as inputs change, and keeps stakeholders aligned.",
    icon: Workflow,
  },
  {
    title: "Ship with confidence",
    description: "Links specs to delivery, opens issues, and reviews PRs for requirement coverage.",
    icon: GitPullRequest,
  },
  {
    title: "Security first",
    description: "Granular permissions and full auditability. Your data stays secure and under your control.",
    icon: ShieldCheck,
  },
]

export default function Features() {
  return (
    <section id="features" className="relative bg-white">
      <div className="container py-14 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            Built for modern product teams
          </h2>
          <p className="mt-3 text-neutral-600">
            Not a chat bot. Bevin.AI executes the product loop—brief, plan, validate, and ship—so your team delivers
            faster.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
          {features.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="group relative overflow-hidden rounded-xl border border-orange-200 bg-white/80 p-5 transition hover:shadow-md hover:border-orange-300"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500/15 to-amber-500/15 ring-1 ring-inset ring-orange-200/40">
                <Icon className="h-5 w-5 text-orange-500" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-neutral-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{description}</p>
              <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-orange-500/10 blur-3xl transition-opacity group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
