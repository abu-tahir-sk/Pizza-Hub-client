import {
  HeroSection,
  FeaturedMenuSection,
  CategoriesSection,
  WhyChooseUsSection,
  TestimonialsSection,
  VendorCtaSection,
} from "@/components/home";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Showcase Banner */}
      <HeroSection />

      {/* 2. Dynamic Section 1: Featured Menu Items (Approved & Active) */}
      <FeaturedMenuSection />

      {/* 3. Dynamic Section 2: Pizza Categories Showcase (6 Signature Categories) */}
      <CategoriesSection />

      {/* 4. Extra Section 1 (Required): Why Choose PizzaHub */}
      <WhyChooseUsSection />

      {/* 5. Extra Section 2: Customer Testimonials */}
      <TestimonialsSection />

      {/* 6. Partner with PizzaHub Vendor CTA */}
      <VendorCtaSection />
    </div>
  );
}
