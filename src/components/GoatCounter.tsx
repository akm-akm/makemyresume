"use client";

import Script from "next/script";

export default function GoatCounter() {
  // Replace 'YOUR-CODE' with your GoatCounter code from https://www.goatcounter.com
  // Example: if your site is makemyresume.goatcounter.com, use 'makemyresume'
  const goatCounterCode = process.env.NEXT_PUBLIC_GOATCOUNTER_CODE || "makemyresume";

  return (
    <Script
      data-goatcounter={`https://${goatCounterCode}.goatcounter.com/count`}
      async
      src="//gc.zgo.at/count.js"
      strategy="afterInteractive"
    />
  );
}

