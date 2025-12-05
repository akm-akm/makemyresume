"use client";

import Script from "next/script";

export default function GoatCounter() {
  const goatCounterCode = process.env.NEXT_PUBLIC_GOATCOUNTER_CODE || "makemyresume";

  return (
    <Script
      data-goatcounter={`https://${goatCounterCode}.goatcounter.com/count`}
      data-goatcounter-settings='{"allow_local": true}'
      async
      src="//gc.zgo.at/count.js"
      strategy="afterInteractive"
    />
  );
}

