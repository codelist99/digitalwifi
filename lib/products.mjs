export const products = Object.freeze({
  front: { name: 'Wifi Digital System', amount: 17, next: '/oto1' },
  oto1: { name: 'Wifi Digital System — Unlimited Upgrade', amount: 197, next: '/oto2' },
  oto1_downsell: { name: 'Wifi Digital System — Unlimited Upgrade Discount', amount: 147, next: '/oto2' },
  oto2: { name: 'Wifi Digital System — Done-For-You Upgrade', amount: 197, next: '/oto3' },
  oto2_downsell: { name: 'Wifi Digital System — Done-For-You Discount', amount: 97, next: '/oto3' },
  oto3: { name: 'Wifi Digital System — Cyber Security Protection', amount: 127, next: '/oto4' },
  oto3_downsell: { name: 'Wifi Digital System — Cyber Security Discount', amount: 97, next: '/oto4' },
  oto4: { name: 'Wifi Digital System — Instant Income Upgrade', amount: 97, next: '/oto5' },
  oto4_downsell: { name: 'Wifi Digital System — Instant Income Discount', amount: 67, next: '/oto5' },
  oto5: { name: 'Wifi Digital System — Autopilot Earnings', amount: 147, next: '/oto6' },
  oto5_downsell: { name: 'Wifi Digital System — Autopilot Earnings Discount', amount: 47, next: '/oto6' },
  oto6: { name: 'Wifi Digital System — High Ticket Payouts', amount: 97, next: '/oto7' },
  oto6_downsell: { name: 'Wifi Digital System — High Ticket Payouts Discount', amount: 47, next: '/oto7' },
  oto7: { name: 'Wifi Digital System — License Rights', amount: 167, next: '/thankyou' },
  oto7_downsell: { name: 'Wifi Digital System — License Rights Discount', amount: 67, next: '/thankyou' }
});

export function getProduct(id) {
  const product = products[id];
  if (!product) throw new Error('Unknown product');
  return { id, ...product, currency: 'USD' };
}
