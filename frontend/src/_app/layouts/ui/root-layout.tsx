import type { Metadata, Viewport } from "next";
import type { JSX, PropsWithChildren } from "react";

import { siteConfig, titleSiteTemplate } from "@/shared/config";

import "@/shared/styles";

export const metadata: Metadata = {
  title: { default: siteConfig.title, template: titleSiteTemplate(siteConfig.title) },
  description: siteConfig.description,
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export function RootLayout({ children }: PropsWithChildren): JSX.Element {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
