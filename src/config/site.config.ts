/**
 * Stack Docs Platform Configuration
 * 
 * Centralized site configuration using a static object.
 * This replaces the need for a database-backed SiteConfig table for non-dynamic settings.
 */

export const siteConfig = {
  name: "Stack Docs",
  tagline: "Fullstack Development uchun zamonaviy darsliklar platformasi",
  description: "Modern, production-ready documentation platform for teaching Fullstack Development",
  logo: "/logo.svg", // Logo path in public directory
  
  // SEO Metadata
  meta: {
    title: "Stack Docs - Fullstack Development",
    description: "Fullstack developmentni o'rganish uchun eng qulay va zamonaviy darsliklar manbasi.",
    keywords: ["fullstack", "development", "react", "nextjs", "prisma", "supabase", "uzbek"],
  },
  
  // Social Links
  socialLinks: {
    github: "https://github.com/farhodoff/stack", // Example
    twitter: "https://twitter.com/farhodoff",
    telegram: "https://t.me/fullstack_uz",
  },
  
  // Features
  features: {
    allowComments: true,
    allowRegistration: true,
    maintenanceMode: false,
  },
  
  // Analytics
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || "",
  },
  
  // Localization
  defaultLocale: "uz",
};

export type SiteConfig = typeof siteConfig;
