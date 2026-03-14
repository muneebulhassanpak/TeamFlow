import Link from "next/link"
import {
  Activity,
  ArrowRight,
  Bell,
  Check,
  Kanban,
  Layers,
  ListTodo,
  Users,
  Zap,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { LandingNavbar } from "./landing-navbar"

const FEATURES = [
  {
    icon: Kanban,
    title: "Real-time Kanban Boards",
    description:
      "Drag tasks across columns and watch your board update instantly for every team member.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Invite teammates, assign roles, and manage project access with granular permissions.",
  },
  {
    icon: Zap,
    title: "Live Sync",
    description:
      "Every update propagates instantly across all connected clients — no refresh needed.",
  },
  {
    icon: ListTodo,
    title: "Rich Task Management",
    description:
      "Set priorities, due dates, and assignees. View all your tasks across every project in one place.",
  },
  {
    icon: Activity,
    title: "Activity Logs",
    description:
      "Track every change across your organisation with a full, filterable audit trail.",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Get notified when tasks are assigned to you or invitations arrive — no noise, just signal.",
  },
]

const PLANS = [
  {
    name: "Free",
    price: "$0",
    description: "For individuals and small teams just getting started.",
    features: [
      "Up to 3 projects",
      "5 team members",
      "Basic kanban boards",
      "Activity logs",
    ],
    cta: "Get started",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    description: "For growing teams that need more power.",
    features: [
      "Unlimited projects",
      "Up to 20 members",
      "Priority & due-date tracking",
      "Advanced filters",
      "Email notifications",
    ],
    cta: "Start free trial",
    href: "/signup",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$29",
    description: "For larger organisations that need everything.",
    features: [
      "Unlimited everything",
      "Unlimited members",
      "Priority support",
      "SSO / SAML",
      "Custom roles",
    ],
    cta: "Contact sales",
    href: "/signup",
    highlighted: false,
  },
]

const KANBAN_COLUMNS = [
  {
    label: "Todo",
    color: "text-muted-foreground",
    cards: [
      { title: "Design landing page", priority: "high" },
      { title: "Set up CI pipeline", priority: "medium" },
    ],
  },
  {
    label: "In Progress",
    color: "text-blue-500",
    cards: [
      { title: "Build auth module", priority: "urgent" },
      { title: "Write API docs", priority: "low" },
    ],
  },
  {
    label: "In Review",
    color: "text-yellow-500",
    cards: [{ title: "Kanban drag & drop", priority: "high" }],
  },
  {
    label: "Done",
    color: "text-green-500",
    cards: [
      { title: "Database schema", priority: "high" },
      { title: "Invite flow", priority: "medium" },
    ],
  },
]

const PRIORITY_COLORS: Record<string, string> = {
  urgent: "text-destructive",
  high: "text-orange-500",
  medium: "text-yellow-500",
  low: "text-muted-foreground",
}

export function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col">
      <LandingNavbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  )
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* Subtle radial glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6 text-center">
        <Badge variant="secondary" className="mb-6 px-3 py-1 text-sm">
          ✨ Real-time collaboration — now live
        </Badge>

        <h1 className="mx-auto mb-6 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Project management{" "}
          <span className="text-primary">that actually ships</span>
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground">
          TeamFlow brings your team together with real-time Kanban boards,
          smart task management, and powerful collaboration tools — all in one
          place.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button size="lg" asChild>
            <Link href="/signup">
              Get started for free <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#features">See the features</Link>
          </Button>
        </div>

        {/* Kanban board mockup */}
        <div className="mx-auto mt-16 max-w-4xl overflow-hidden rounded-xl border bg-muted/30 shadow-xl">
          {/* Window chrome */}
          <div className="flex items-center gap-1.5 border-b bg-muted/50 px-4 py-3">
            <div className="size-3 rounded-full bg-destructive/60" />
            <div className="size-3 rounded-full bg-yellow-400/60" />
            <div className="size-3 rounded-full bg-green-400/60" />
            <div className="ml-4 h-5 w-48 rounded-md bg-muted-foreground/10" />
          </div>
          {/* Board */}
          <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
            {KANBAN_COLUMNS.map((col) => (
              <div key={col.label} className="rounded-lg bg-background/70 p-2">
                <p className={`mb-2 text-xs font-semibold ${col.color}`}>
                  {col.label}
                </p>
                <div className="space-y-2">
                  {col.cards.map((card) => (
                    <div
                      key={card.title}
                      className="rounded-md border bg-background p-2 text-left shadow-sm"
                    >
                      <p className="text-xs font-medium leading-snug">
                        {card.title}
                      </p>
                      <span
                        className={`mt-1 text-[10px] font-bold uppercase ${PRIORITY_COLORS[card.priority]}`}
                      >
                        {card.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  return (
    <section id="features" className="border-t py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <Badge variant="secondary" className="mb-4">
            Features
          </Badge>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Everything your team needs
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            A complete toolkit for modern project management — from planning to
            delivery.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title}>
                <CardHeader className="pb-3">
                  <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function PricingSection() {
  return (
    <section id="pricing" className="border-t bg-muted/20 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <Badge variant="secondary" className="mb-4">
            Pricing
          </Badge>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground">
            No hidden fees. No surprises. Cancel any time.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 md:items-center">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={
                plan.highlighted
                  ? "relative scale-[1.03] border-primary shadow-lg"
                  : ""
              }
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <Badge>Most popular</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "$0" && (
                    <span className="text-muted-foreground">/month</span>
                  )}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="size-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  asChild
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Ready to ship faster?
        </h2>
        <p className="mb-8 text-lg text-muted-foreground">
          Join teams already using TeamFlow to plan, track, and deliver their
          best work.
        </p>
        <Button size="lg" asChild>
          <Link href="/signup">
            Start for free <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </div>
    </section>
  )
}

function LandingFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Layers className="size-3.5" />
              </div>
              <span className="font-semibold">TeamFlow</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Project management for modern teams.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="#features"
                  className="transition-colors hover:text-foreground"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="transition-colors hover:text-foreground"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/changelog"
                  className="transition-colors hover:text-foreground"
                >
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/about"
                  className="transition-colors hover:text-foreground"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="transition-colors hover:text-foreground"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="transition-colors hover:text-foreground"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/privacy"
                  className="transition-colors hover:text-foreground"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="transition-colors hover:text-foreground"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} TeamFlow. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
