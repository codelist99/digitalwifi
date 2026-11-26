+(() => {
  if (!/^\/thankyou\/?$/.test(location.pathname)) return;
  const enhanceThankYou = () => {
    document.querySelectorAll('.cta-member-access,.wc-account-section').forEach(element=>element.remove());
    document.querySelectorAll('body > aside a[href="/member-login"]').forEach(link=>link.closest('aside')?.remove());
    document.querySelectorAll('a[href="/member-login"]').forEach(link=>{
      const container=link.closest('section,aside');
      if(container&&!container.classList.contains('wc-call-now')&&/access your|create your account|activate member access/i.test(container.textContent||''))container.remove();
    });
    let callout=document.querySelector('.wc-call-now');
    if(!callout){callout=document.createElement('section');callout.className='wc-call-now';document.body.prepend(callout)}
    if(callout.dataset.compactThankYou==='true')return;
    callout.dataset.compactThankYou='true';
    callout.classList.add('compact-thank-you');
    callout.innerHTML='<div class="compact-inner"><h1>Congratulations</h1><div class="refund-notice">FOR REFUNDS PLEASE EMAIL SUPPORT@KAIROSTECHNOLOGYLABS.COM</div><div class="dispute-warning">DO NOT FILE A DISPUTE. THEN WE ARE FORCED TO FIGHT THE DISPUTE, WHICH CAN OFTEN LEAD TO YOU LOSING. CALL US FOR A NO-QUESTIONS-ASKED REFUND.</div><h2>CALL OUR OFFICE NOW TO GET STARTED</h2><a class="phone" href="tel:+12067032153">(206) 703-2153</a><div class="action-row"><a class="schedule" href="https://cal.com/jon19/wificode-onboarding" target="_blank" rel="noreferrer noopener">SCHEDULE ONBOARDING</a><a class="member-access" href="/member-login">CREATE YOUR ACCOUNT</a></div></div>';
  };
  const style=document.createElement('style');
  style.textContent='.wc-call-now.compact-thank-you{box-sizing:border-box!important;min-height:0!important;padding:14px 18px 20px!important;border-bottom:6px solid #ffd43b!important;background:linear-gradient(135deg,#06135c,#0b4db8)!important}.wc-call-now.compact-thank-you .compact-inner{width:min(1180px,100%)!important;max-width:1180px!important;margin:0 auto!important}.wc-call-now.compact-thank-you h1{margin:0 0 8px!important;font:900 clamp(42px,6vw,74px)/.95 Arial,sans-serif!important}.wc-call-now.compact-thank-you .refund-notice{box-sizing:border-box!important;margin:0 auto 8px!important;padding:10px 14px!important;border:3px solid #ffd43b!important;border-radius:12px!important;background:#fff!important;color:#081b61!important;white-space:normal!important;font:900 clamp(13px,1.55vw,20px)/1.1 Arial,sans-serif!important}.wc-call-now.compact-thank-you .dispute-warning{box-sizing:border-box!important;margin:0 auto 10px!important;padding:9px 14px!important;border:2px solid #fff!important;border-radius:10px!important;background:#b91c1c!important;color:#fff!important;font:900 clamp(12px,1.25vw,17px)/1.15 Arial,sans-serif!important;letter-spacing:.01em!important}.wc-call-now.compact-thank-you h2{margin:8px 0!important;font:900 clamp(25px,3.5vw,44px)/1 Arial,sans-serif!important}.wc-call-now.compact-thank-you a.phone{display:inline-block!important;width:auto!important;margin:0 auto 12px!important;padding:12px 28px!important;border-radius:12px!important;background:#22c55e!important;color:#fff!important;font:900 clamp(30px,4vw,50px)/1 Arial,sans-serif!important;box-shadow:0 6px 0 #147a38!important}.wc-call-now.compact-thank-you .action-row{display:grid!important;grid-template-columns:1fr 1fr!important;gap:16px!important;margin:0 auto!important}.wc-call-now.compact-thank-you .action-row a{box-sizing:border-box!important;display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;min-height:72px!important;margin:0!important;padding:12px 18px!important;border-radius:12px!important;color:#fff!important;text-decoration:none!important;font:900 clamp(19px,2.3vw,30px)/1 Arial,sans-serif!important}.wc-call-now.compact-thank-you .schedule{background:#7c3aed!important;box-shadow:0 6px 0 #4c1d95!important}.wc-call-now.compact-thank-you .member-access{background:#ef1d24!important;box-shadow:0 6px 0 #8f1116!important}@media(max-width:700px){.wc-call-now.compact-thank-you{padding:12px 10px 18px!important}.wc-call-now.compact-thank-you .action-row{grid-template-columns:1fr!important;gap:12px!important}.wc-call-now.compact-thank-you .action-row a{min-height:58px!important}.wc-call-now.compact-thank-you a.phone{width:100%!important}.wc-call-now.compact-thank-you h1{font-size:42px!important}}';
  document.head.appendChild(style);
  const mobileUpgradeRepair=document.createElement('style');
  mobileUpgradeRepair.textContent='@media(max-width:767px){#row-OhZHbSVWr3>.inner{display:flex!important;flex-direction:column!important}#col-sDsIL-1L91,#col-Vbe7V42goy{box-sizing:border-box!important;width:100%!important;max-width:100%!important;padding:10px 14px!important}#heading-0Vog27u2MO,#heading-dHXuPLGoz6{width:100%!important;max-width:100%!important}#heading-0Vog27u2MO h1,#heading-0Vog27u2MO h2,#heading-0Vog27u2MO h3,#heading-0Vog27u2MO .text-output,#heading-dHXuPLGoz6 h1,#heading-dHXuPLGoz6 h2,#heading-dHXuPLGoz6 h3,#heading-dHXuPLGoz6 .text-output{font-size:clamp(26px,8vw,38px)!important;line-height:1.15!important;overflow-wrap:normal!important;word-break:normal!important;white-space:normal!important}#image-kHAvaD_dmY img{display:block!important;width:100%!important;max-width:430px!important;height:auto!important;margin:auto!important}}';
  document.head.appendChild(mobileUpgradeRepair);
  enhanceThankYou();
  addEventListener('load',enhanceThankYou,{once:true});
  new MutationObserver(enhanceThankYou).observe(document.body,{childList:true,subtree:true});
})();


(() => {
  const params = new URLSearchParams(location.search);
  const attribution = Object.fromEntries(['aid','tid','utm_source','utm_campaign'].map(key => [key, params.get(key) || localStorage.getItem(`wc_${key}`) || '']));
  Object.entries(attribution).forEach(([key,value]) => value && localStorage.setItem(`wc_${key}`, value));
  let sessionId=sessionStorage.getItem('wc_session_id');if(!sessionId){sessionId=globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`;sessionStorage.setItem('wc_session_id',sessionId)}
  const device=innerWidth<768?'Mobile':innerWidth<1100?'Tablet':'Desktop',context={...attribution,session_id:sessionId,device};
  const send = (url, data) => fetch(url, { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(data), keepalive:true }).catch(()=>{});
  send('/api/events', { type:'page_view', page:location.pathname, ...context });
  document.addEventListener('click', event => {
    if (!/^\/thankyou\/?$/.test(location.pathname)) return;
    const link = event.target.closest('a[href]');
    if (!link) return;
    const label = link.textContent.replace(/\s+/g, ' ').trim();
    let target;
    try { target = new URL(link.href, location.href); } catch { return; }
    if (target.pathname === '/webinar' || /click here to see how/i.test(label)) {
      send('/api/events', { type:'step2_webinar_click', page:location.pathname, product_id:target.href, ...context });
    }
  }, true);
  if(location.pathname==='/checkout'){let started=false;document.addEventListener('focusin',event=>{if(!started&&event.target.matches('input,select')){started=true;send('/api/events',{type:'checkout_start',page:location.pathname,...context})}},true)}
  document.querySelectorAll('video').forEach(video=>{const fired=new Set();const fire=type=>{if(fired.has(type))return;fired.add(type);send('/api/events',{type,page:location.pathname,...context})};video.addEventListener('volumechange',()=>{if(!video.muted&&video.volume>0)fire('video_unmute')});video.addEventListener('timeupdate',()=>{if(!video.duration)return;const progress=video.currentTime/video.duration;if(progress>=.25)fire('video_25');if(progress>=.5)fire('video_50');if(progress>=.75)fire('video_75');if(progress>=.98)fire('video_100')})});
  document.addEventListener('submit', event => {
    const form = event.target;
    const data = Object.fromEntries(new FormData(form));
    const email = data.email || data.Email || form.querySelector('input[type=email]')?.value;
    const phone = data.phone || data.Phone || form.querySelector('input[type=tel]')?.value;
    if (!email && !phone) return;
    send('/api/leads', { ...data, email, phone, email_consent:Boolean(data.email_consent || form.querySelector('[name*=email_consent]:checked')),
      sms_consent:Boolean(data.sms_consent || form.querySelector('[name*=sms_consent]:checked')), landing_page:location.pathname, ...attribution });
  }, true);
  const isCheckoutDestination = value => /\/buy\//i.test(String(value || ''));
  const nativeOpen = window.open.bind(window);
  window.open = (url, ...args) => {
    if (!location.pathname.match(/^\/oto[1-7]\/?$/) && isCheckoutDestination(url)) {
      send('/api/events', { type:'checkout_click', page:location.pathname, product_id:String(url), ...context });
      location.href = '/checkout?product=front';
      return null;
    }
    return nativeOpen(url, ...args);
  };
  document.addEventListener('click', event => {
    const link = event.composedPath().find(node => node?.tagName === 'A' && isCheckoutDestination(node.href)) || event.target.closest?.('a[href*="/buy/"]');
    if (!link) return;
    send('/api/events', { type:'checkout_click', page:location.pathname, product_id:link.href, ...context });
    const oto = location.pathname.match(/^\/oto([1-7])\/?$/);
    if (!oto) {
      event.preventDefault();
      location.href = '/checkout?product=front';
      return;
    }
    event.preventDefault();
    const discounted = new URL(link.href, location.href).searchParams.has('coupon');
    const product = `oto${oto[1]}${discounted ? '_downsell' : ''}`;
    const label = link.textContent;
    link.style.pointerEvents = 'none';
    link.textContent = 'Processing…';
    fetch('/api/purchase', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({product}) })
      .then(async response => { const data=await response.json(); if(!response.ok)throw Error(data.error||'Purchase failed'); location.href=data.next; })
      .catch(error => { link.style.pointerEvents=''; link.textContent=label; alert(error.message); });
  }, true);
})();
