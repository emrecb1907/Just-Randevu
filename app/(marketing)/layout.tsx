import type { ReactNode } from "react";

import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { MarketingFooter } from "@/components/marketing-footer";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <MarketingFooter />
      <CookieConsentBanner />
    </>
  );
}
