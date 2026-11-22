import {
  HeroSection,
  CategoriesSection,
  FeaturedMenuSection,
  WhyChooseUsSection,
  HowItWorksSection,
  VendorCtaSection,
} from "@/components/home";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors">
      {/* 1. Hero Section matching Image 1: headline, CTA, pizza platter & 4 bottom features */}
      <HeroSection />

      {/* 2. Category Cards (3 portrait image cards) */}
      <CategoriesSection />

      {/* 3. Popular Right Now (8 dishes grid) */}
      <FeaturedMenuSection />

      {/* 4. Why PizzaHub (3 pillar feature cards) */}
      <WhyChooseUsSection />

      {/* 5. How PizzaHub Works (3 numbered step cards) */}
      <HowItWorksSection />

      {/* 6. Vendor CTA (Put your kitchen on the PizzaHub menu) */}
      <VendorCtaSection />
    </div>
  );
}
