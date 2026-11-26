import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { AppShell } from "@/components/layout/app-shell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-heading-brand",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "PizzaHub — Hot & Fresh Pizza Delivered",
    template: "%s | PizzaHub",
  },
  description:
    "PizzaHub is a pizza ordering & delivery platform. Discover local pizza shops, browse menus, and place orders.",
  icons: {
    icon: [
      { url: "/favicon.ico?v=20261126v3", sizes: "any" },
      { url: "/icon.svg?v=20261126v3", type: "image/svg+xml" },
      { url: "/icon.png?v=20261126v3", type: "image/png", sizes: "48x48" },
    ],
    shortcut: "/favicon.ico?v=20261126v3",
    apple: "/apple-icon.png?v=20261126v3",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${plusJakartaSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico?v=20261126v3" sizes="any" />
        <link rel="icon" href="/icon.svg?v=20261126v3" type="image/svg+xml" />
        <link rel="icon" href="/icon.png?v=20261126v3" type="image/png" sizes="48x48" />
        <link rel="apple-touch-icon" href="/apple-icon.png?v=20261126v3" />
      </head>
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        {/* Apply the saved theme before first paint to avoid a light flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("pizzahub-theme");if(t!=="light"){document.documentElement.classList.add("dark");}else{document.documentElement.classList.remove("dark");}}catch(e){document.documentElement.classList.add("dark");}})();`,
          }}
        />
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
