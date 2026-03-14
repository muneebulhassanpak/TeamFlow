"use client"

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
import { motion, type Variants } from "framer-motion"
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

// ─── Animation variants ────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

// ─── Data ──────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Kanban,
    title: "Real-time Kanban Boards",
    description:
      "Drag tasks across columns and watch every board update live for your entire team — no refresh, no conflicts.",
    accent: "text-blue-500",
    bg: "bg-blue-500/10",
    large: true,
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Invite teammates, assign roles, and manage project access with granular per-project permissions.",
    accent: "text-violet-500",
    bg: "bg-violet-500/10",
    large: false,
  },
  {
    icon: Zap,
    title: "Live Sync",
    description:
      "Powered by Supabase Realtime. Every update propagates instantly to all connected clients.",
    accent: "text-amber-500",
    bg: "bg-amber-500/10",
    large: false,
  },
  {
    icon: ListTodo,
    title: "Rich Task Management",
    description:
      "Set priorities, due dates, and assignees. See all your tasks across every project in one place.",
    accent: "text-emerald-500",
    bg: "bg-emerald-500/10",
    large: false,
  },
  {
    icon: Activity,
    title: "Activity Logs",
    description:
      "A full, filterable audit trail of every change across your organisation — who did what and when.",
    accent: "text-orange-500",
    bg: "bg-orange-500/10",
    large: false,
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Get notified the moment tasks are assigned to you or invitations arrive. No noise — just signal.",
    accent: "text-rose-500",
    bg: "bg-rose-500/10",
    large: false,
  },
]

const PLANS = [
  {
    name: "Starter",
    price: "$0",
    period: "",
    description: "For individuals and small teams getting started.",
    features: [
      "Up to 3 projects",
      "5 team members",
      "Basic kanban boards",
      "Activity logs",
      "Email support",
    ],
    cta: "Get started free",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/mo",
    description: "For growing teams that need more power.",
    features: [
      "Unlimited projects",
      "Up to 20 members",
      "Priority & due-date tracking",
      "Advanced filters & search",
      "Email notifications",
      "Priority support",
    ],
    cta: "Start free trial",
    href: "/signup",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$29",
    period: "/mo",
    description: "For organisations that need everything.",
    features: [
      "Unlimited everything",
      "Unlimited members",
      "Custom roles & permissions",
      "SSO / SAML",
      "Dedicated support",
      "SLA guarantee",
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
      { title: "Design landing page", priority: "high", priorityColor: "text-orange-500" },
      { title: "Set up CI pipeline", priority: "medium", priorityColor: "text-yellow-500" },
    ],
  },
  {
    label: "In Progress",
    color: "text-blue-500",
    cards: [
      { title: "Build auth module", priority: "urgent", priorityColor: "text-destructive" },
      { title: "Write API docs", priority: "low", priorityColor: "text-muted-foreground" },
    ],
  },
  {
    label: "In Review",
    color: "text-yellow-500",
    cards: [
      { title: "Kanban drag & drop", priority: "high", priorityColor: "text-orange-500" },
    ],
  },
  {
    label: "Done",
    color: "text-emerald-500",
    cards: [
      { title: "Database schema", priority: "high", priorityColor: "text-orange-500" },
      { title: "Invite flow", priority: "medium", priorityColor: "text-yellow-500" },
    ],
  },
]

const STATS = [
  { value: "500+", label: "teams onboarded" },
  { value: "12k+", label: "tasks shipped" },
  { value: "99.9%", label: "uptime" },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

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

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-36">
      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 -z-20 opacity-40 dark:opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Colour orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -right-40 top-20 h-[400px] w-[400px] rounded-full bg-violet-500/8 blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-[80px]" />
      </div>

      <div className="mx-auto max-w-5xl px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-1.5 text-sm backdrop-blur-sm"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-muted-foreground">
            Real-time collaboration —{" "}
            <span className="font-medium text-foreground">now live</span>
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="mx-auto mb-6 max-w-3xl text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl"
        >
          Ship projects{" "}
          <span className="bg-gradient-to-br from-primary via-primary to-primary/50 bg-clip-text text-transparent">
            faster
          </span>
          <br />
          as a team
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
          className="mx-auto mb-10 max-w-lg text-lg text-muted-foreground"
        >
          TeamFlow unifies your team with real-time Kanban boards, smart task
          management, and deep collaboration — all in one place.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <Button size="lg" className="group h-12 px-7 text-base" asChild>
            <Link href="/signup">
              Get started free
              <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 px-7 text-base"
            asChild
          >
            <Link href="#features">See features</Link>
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-8"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Kanban mockup */}
        <motion.div
          initial={{ opacity: 0, y: 48, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
          className="relative mx-auto mt-16 max-w-4xl"
        >
          {/* Glow behind mockup */}
          <div className="absolute inset-x-10 -top-4 h-12 rounded-full bg-primary/20 blur-2xl" />
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-background/80 shadow-2xl backdrop-blur-sm">
            {/* Window chrome */}
            <div className="flex items-center gap-1.5 border-b border-border/60 bg-muted/40 px-4 py-3">
              <div className="size-3 rounded-full bg-destructive/50" />
              <div className="size-3 rounded-full bg-yellow-400/50" />
              <div className="size-3 rounded-full bg-emerald-400/50" />
              <div className="ml-3 flex h-5 flex-1 max-w-48 items-center justify-center rounded-md bg-muted/60 px-3">
                <span className="text-[10px] text-muted-foreground">
                  teamflow.app/acme/projects/sprint-14
                </span>
              </div>
            </div>
            {/* Board */}
            <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
              {KANBAN_COLUMNS.map((col, colIndex) => (
                <motion.div
                  key={col.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.6 + colIndex * 0.07,
                  }}
                  className="rounded-xl bg-muted/30 p-2.5"
                >
                  <div className="mb-2.5 flex items-center justify-between">
                    <p
                      className={`text-[11px] font-semibold uppercase tracking-wide ${col.color}`}
                    >
                      {col.label}
                    </p>
                    <span className="text-[10px] text-muted-foreground">
                      {col.cards.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {col.cards.map((card) => (
                      <div
                        key={card.title}
                        className="rounded-lg border border-border/60 bg-background p-2.5 text-left shadow-sm"
                      >
                        <p className="text-[11px] font-medium leading-snug text-foreground">
                          {card.title}
                        </p>
                        <span
                          className={`mt-1.5 inline-flex rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${card.priorityColor} bg-current/5`}
                        >
                          {card.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          {/* Bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-16 rounded-b-2xl bg-gradient-to-t from-background to-transparent" />
        </motion.div>
      </div>
    </section>
  )
}

// ─── Features ─────────────────────────────────────────────────────────────────

function FeaturesSection() {
  const [largeFeature, ...rest] = FEATURES

  return (
    <section id="features" className="border-t py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Features
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Built for how teams actually work
          </h2>
          <p className="mx-auto max-w-lg text-muted-foreground">
            Every tool your team needs — deeply integrated, beautifully
            designed.
          </p>
        </motion.div>

        {/* Bento grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {/* Large card — Kanban */}
          <motion.div
            variants={fadeUp}
            className="sm:col-span-2 lg:col-span-2"
          >
            <Card className="group h-full cursor-default overflow-hidden border-border/60 transition-all duration-300 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5">
              <CardHeader>
                <div
                  className={`mb-3 flex size-11 items-center justify-center rounded-xl ${largeFeature.bg} ${largeFeature.accent}`}
                >
                  <largeFeature.icon className="size-5" />
                </div>
                <CardTitle className="text-lg">{largeFeature.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {largeFeature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Mini kanban visual */}
                <div className="grid grid-cols-3 gap-2 rounded-xl border border-border/40 bg-muted/30 p-3">
                  {[
                    {
                      label: "Todo",
                      color: "bg-muted-foreground/20",
                      cards: 3,
                    },
                    {
                      label: "In Progress",
                      color: "bg-blue-500/20",
                      cards: 2,
                    },
                    { label: "Done", color: "bg-emerald-500/20", cards: 4 },
                  ].map((col) => (
                    <div key={col.label} className="space-y-1.5">
                      <div
                        className={`h-1.5 w-8 rounded-full ${col.color}`}
                      />
                      {Array.from({ length: col.cards }).map((_, i) => (
                        <div
                          key={i}
                          className="h-6 rounded-md bg-background/80 border border-border/30"
                          style={{ opacity: 1 - i * 0.15 }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Small cards */}
          {rest.map((feature) => (
            <motion.div key={feature.title} variants={fadeUp}>
              <Card
                className={`group h-full cursor-default border-border/60 transition-all duration-300 hover:border-${feature.accent.replace("text-", "")}/40 hover:shadow-md`}
              >
                <CardHeader>
                  <div
                    className={`mb-3 flex size-10 items-center justify-center rounded-xl ${feature.bg} ${feature.accent}`}
                  >
                    <feature.icon className="size-4.5" />
                  </div>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

function PricingSection() {
  return (
    <section id="pricing" className="border-t py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Pricing
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground">
            No hidden fees. No surprises. Cancel any time.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={stagger}
          className="grid gap-6 md:grid-cols-3 md:items-stretch"
        >
          {PLANS.map((plan) => (
            <motion.div key={plan.name} variants={fadeUp} className="flex">
              <Card
                className={`relative flex w-full flex-col overflow-hidden transition-shadow duration-300 ${
                  plan.highlighted
                    ? "border-primary shadow-xl shadow-primary/10"
                    : "border-border/60 hover:shadow-md"
                }`}
              >
                {plan.highlighted && (
                  <>
                    {/* Gradient top bar */}
                    <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />
                    <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/[0.03] to-transparent" />
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <Badge className="shadow-sm">Most popular</Badge>
                    </div>
                  </>
                )}
                <CardHeader className="pb-4 pt-8">
                  <p className="text-sm font-semibold text-muted-foreground">
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-5xl font-bold tracking-tight">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                  <CardDescription className="text-sm">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-6">
                  <ul className="flex-1 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm">
                        <div className="flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <Check className="size-2.5 text-primary" />
                        </div>
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

function CtaSection() {
  return (
    <section className="border-t py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-muted/60 via-background to-muted/30 px-8 py-16 text-center md:px-16"
        >
          {/* Background orbs */}
          <div className="pointer-events-none absolute -left-20 -top-20 size-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 size-64 rounded-full bg-violet-500/8 blur-3xl" />

          <motion.p
            variants={fadeUp}
            className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary"
          >
            Get started today
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Your team deserves better tools
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mx-auto mb-8 max-w-md text-muted-foreground"
          >
            Join hundreds of teams already using TeamFlow to plan, track, and
            deliver their best work together.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          >
            <Button size="lg" className="group h-12 px-8 text-base" asChild>
              <Link href="/signup">
                Start for free
                <ArrowRight className="ml-2 size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="h-12 px-8 text-base"
              asChild
            >
              <Link href="/login">Sign in</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function LandingFooter() {
  return (
    <footer className="border-t bg-muted/20">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-4 sm:col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Layers className="size-4" />
              </div>
              <span className="font-semibold">TeamFlow</span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Project management for modern teams. Ship faster, collaborate
              better.
            </p>
          </div>

          {[
            {
              title: "Product",
              links: [
                { label: "Features", href: "#features" },
                { label: "Pricing", href: "#pricing" },
                { label: "Changelog", href: "/changelog" },
                { label: "Roadmap", href: "/roadmap" },
              ],
            },
            {
              title: "Company",
              links: [
                { label: "About", href: "/about" },
                { label: "Blog", href: "/blog" },
                { label: "Careers", href: "/careers" },
              ],
            },
            {
              title: "Legal",
              links: [
                { label: "Privacy", href: "/privacy" },
                { label: "Terms", href: "/terms" },
                { label: "Security", href: "/security" },
              ],
            },
          ].map((col) => (
            <div key={col.title} className="space-y-4">
              <h4 className="text-sm font-semibold">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-10" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TeamFlow. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with Next.js & Supabase
          </p>
        </div>
      </div>
    </footer>
  )
}
