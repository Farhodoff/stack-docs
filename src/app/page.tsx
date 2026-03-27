import Link from "next/link";
import {
  ArrowRight,
  Database,
  Layout,
  Server,
  Zap,
  ShieldCheck,
  Github,
  BookOpen,
  Code2,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Layout,
    title: "🎨 Frontend (Ön Qism)",
    description:
      "React, Next.js App Router va Tailwind CSS orqali chiroyli va responsive interfeys quring.",
  },
  {
    icon: Server,
    title: "⚙️ Backend (Orqa Qism)",
    description:
      "Node.js, Next.js Route Handlers orqali masshtabli API quring.",
  },
  {
    icon: Database,
    title: "📊 Database (Ma'lumotlar Bazasi)",
    description:
      "PostgreSQL, Prisma ORM bilan ma'lumotlarni saqlash va boshqarish.",
  },
  {
    icon: ShieldCheck,
    title: "🔐 Authentication (Autentifikatsiya)",
    description:
      "Xavfsiz login, session va OAuth qoq NextAuth.js orqali.",
  },
  {
    icon: Cpu,
    title: "🚀 DevOps & Deployment",
    description:
      "Vercel, CI/CD pipelineslari va production monitoring.",
  },
  {
    icon: Zap,
    title: "⭐ Best Practices",
    description:
      "TypeScript, ESLint va industrial standartlarga asoslangan kodni yozish.",
  },
];

const quickStartCards = [
  {
    step: "01",
    title: "Fullstack nima?",
    description:
      "Asosiy tushunchalar va zamonaviy web development olamiga kirish.",
    href: "/docs/introduction/what-is-fullstack",
    icon: BookOpen,
  },
  {
    step: "02",
    title: "Zamonaviy Stack",
    description:
      "Next.js, Node.js va PostgreSQL bilan development environment sozlash.",
    href: "/docs/fullstack/modern-stack",
    icon: Code2,
  },
  {
    step: "03",
    title: "Frontend Asoslar",
    description:
      "React hooks, state management, Tailwind CSS chuqurligi.",
    href: "/docs/frontend/fundamentals",
    icon: Layout,
  },
  {
    step: "04",
    title: "API Qurish",
    description: "REST va GraphQL endpoints yaratish va xavfsizlik.",
    href: "/docs/api/building-apis",
    icon: Server,
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-24 pb-32 lg:pt-36 lg:pb-40">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom dark:border-b dark:border-slate-100/5" />
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 sm:translate-x-0">
          <div className="h-[400px] w-[400px] rounded-full bg-primary/20 blur-[100px]" />
        </div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 sm:translate-x-0">
          <div className="h-[400px] w-[400px] rounded-full bg-blue-500/20 blur-[100px]" />
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <Badge
              variant="outline"
              className="mb-6 py-1.5 px-4 rounded-full border-primary/30 text-primary bg-primary/10"
            >
              <Zap className="mr-2 h-4 w-4 fill-primary" />
              Bepul va Ochiq Kod
            </Badge>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-balance">
              Fullstack{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                Dasturchi
              </span>{" "}
              Bolish
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl text-balance leading-relaxed">
              Zamonaviy web-applikatsiyalar qurish uchun to'liq qo'llanma.
              Next.js, TypeScript, PostgreSQL va Prismani o'z-o'zidan boshlanadi o'rganing.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button
                size="lg"
                className="h-12 px-8 text-base font-medium rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                asChild
              >
                <Link href="/docs/introduction/what-is-fullstack">
                  Boshla 📚
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-8 text-base font-medium rounded-full bg-background/50 backdrop-blur-sm hover:bg-accent transition-all"
                asChild
              >
                <Link
                  href="https://github.com/Farhodoff/js-docs"
                  target="_blank"
                >
                  <Github className="mr-2 h-5 w-5" />
                  GitHub
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-muted/30 border-y">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Barcha narsani o'rganing
            </h2>
            <p className="text-lg text-muted-foreground">
              Zamonaviy stack to'liq qo'llanmasi. Haqiqiy loyihalarga tayyorlanish.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border bg-background hover:bg-muted/50 hover:shadow-md transition-all duration-300 group"
              >
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Oʻqish Yo'li
            </h2>
            <p className="text-lg text-muted-foreground">
              Strukturalashgan darslilingiz bo'ylab asos qilganlardan ilg'or tushunchalargacha.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
            {quickStartCards.map((card, index) => (
              <Link key={index} href={card.href} className="block group">
                <Card className="h-full border-2 border-transparent bg-muted/30 hover:border-primary/50 hover:bg-background transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="text-6xl font-black">{card.step}</span>
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="p-2.5 rounded-md bg-background shadow-sm text-foreground group-hover:text-primary transition-colors">
                        <card.icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {card.title}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-base max-w-[85%] mt-2">
                      {card.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm font-medium text-primary mt-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      Modulga o'tish <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 border-t bg-primary/5 relative overflow-hidden">
        <div className="absolute inset-0  opacity-[0.03] mix-blend-overlay" />
        <div className="container relative z-10 mx-auto px-4 md:px-6 max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            Karerani tezlashtirish uchun tayyor?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Minglagan dasturchilar zamonaviy fullstack arxitekturasini o'rganishda.
            Bepul, Ochiq Kod va Doimiy Yangilanish.
          </p>
          <Button
            size="lg"
            className="h-14 px-10 text-lg rounded-full shadow-xl hover:shadow-primary/25 hover:-translate-y-1 transition-all"
            asChild
          >
            <Link href="/docs/introduction/what-is-fullstack">
              Boshlangi Safar 🚀
              <Zap className="ml-2 h-5 w-5 fill-current" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
