'use client';

import Script from 'next/script';
import { ANALYTICS } from '@/lib/constants';

export function YandexMetrika() {
  return (
    <>
      <Script
        id='yandex-metrika'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{
          __html: `
            (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=${ANALYTICS.yandexMetrikaId}', 'ym');

            ym(${ANALYTICS.yandexMetrikaId}, 'init', {
                ssr:true,
                webvisor:true,
                clickmap:true,
                ecommerce:"dataLayer",
                referrer: document.referrer,
                url: location.href,
                accurateTrackBounce:true,
                trackLinks:true
            });
          `,
        }}
      />
      <noscript>
        <div>
          {/* Yandex Metrika tracking pixel — must be a raw <img>, not next/image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc.yandex.ru/watch/${ANALYTICS.yandexMetrikaId}`}
            style={{ position: 'absolute', left: '-9999px' }}
            alt=''
          />
        </div>
      </noscript>
    </>
  );
}
