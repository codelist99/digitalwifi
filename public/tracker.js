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
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href*="jvzoo.com"],a[href*="/b/"]');
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
