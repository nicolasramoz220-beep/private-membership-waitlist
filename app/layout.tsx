import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const metadataBase = new URL(host ? `${protocol}://${host}` : "https://private-membership.example");
  const socialImage = new URL("/og.png", metadataBase).toString();

  return {
    metadataBase,
    title: "Private Membership — Apply for Access",
    description: "Apply for access to a curated private community.",
    openGraph: {
      title: "Private Membership",
      description: "Apply for access to a curated private community.",
      type: "website",
      images: [{ url: socialImage, width: 1536, height: 1024, alt: "Private Membership" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Private Membership",
      description: "Apply for access to a curated private community.",
      images: [socialImage],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
