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
    <div className="flex min-h-screen flex-col">
      {/* 1. Banner: headline, description, CTA + pizza visual */}
      <HeroSection />

      {/* 2. Dynamic Section 2: Pizza Categories (6 categories) */}
      <CategoriesSection />

      {/* 3. Dynamic Section 1: Featured / popular approved menu items */}
      <FeaturedMenuSection />

      {/* 4. Extra Section 1 (Required): Why Choose PizzaHub */}
      <WhyChooseUsSection />

      {/* 5. Extra Section 2: How PizzaHub Works */}
      <HowItWorksSection />

      {/* 6. Vendor CTA */}
      <VendorCtaSection />
    </div>
  );
}
