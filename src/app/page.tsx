import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { HeroSection } from "@/components/site/HeroSection";
import { ServicesSection } from "@/components/site/ServicesSection";
import { AboutSection } from "@/components/site/AboutSection";
import { GallerySection } from "@/components/site/GallerySection";
import { ContactSection } from "@/components/site/ContactSection";
import { prisma } from "@/lib/prisma";
import { salonConfig } from "@/lib/salon-config";

export const metadata = {
  title: `${salonConfig.name} – Frizerski salon`,
  description: salonConfig.description,
};

export default async function HomePage() {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      description: true,
      durationMin: true,
      priceCents: true,
    },
  });

  return (
    <div className="min-h-screen overflow-x-hidden">
      <SiteHeader />
      <main>
        <HeroSection />
        <ServicesSection services={services} />
        <AboutSection />
        <GallerySection />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}
