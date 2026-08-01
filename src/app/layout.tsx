import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://fairfix.pages.dev"
  ),
  title: {
    default: "FairFix.ie — A fair price. A real tradesman.",
    template: "%s · FairFix.ie",
  },
  description:
    "Ireland's fair-price marketplace for home services. Describe your job, get a fair AI-generated price, then choose from RECI-verified Irish tradesmen. Inspection fee held in escrow.",
  applicationName: "FairFix.ie",
  authors: [{ name: "FairFix.ie" }],
  keywords: [
    "electrician Ireland",
    "plumber Dublin",
    "home services Ireland",
    "tradesmen Ireland",
    "RECI verified",
    "boiler repair",
    "SEAI grant",
    "EV charger installation",
  ],
  openGraph: {
    type: "website",
    locale: "en_IE",
    siteName: "FairFix.ie",
    title: "FairFix.ie — A fair price. A real tradesman.",
    description:
      "The number you actually want, before anyone tries to sell you anything.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FairFix.ie",
    description:
      "Ireland's fair-price marketplace for home services. Verified tradesmen. AI-fair pricing.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBF7EE" },
    { media: "(prefers-color-scheme: dark)", color: "#0A1826" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IE" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
