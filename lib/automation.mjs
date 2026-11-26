import { many, run } from './database.mjs';
import { createHmac } from 'node:crypto';

const interpolate = (text, lead) => String(text || '').replace(/{{\s*(first_name|last_name|email|phone)\s*}}/g, (_, key) => lead[key] || '');

export const purchaseEmailHtml = lead => {
  const firstName=String(lead.first_name||'').trim(),greeting=firstName?` ${firstName}`:'';
  return `<!doctype html><html><body style="margin:0;background:#eef2ff;font-family:Arial,sans-serif;color:#fff"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef2ff"><tr><td align="center" style="padding:24px 10px"><table role="presentation" width="680" cellspacing="0" cellpadding="0" style="width:100%;max-width:680px;background:linear-gradient(135deg,#06135c,#0b4db8);border-bottom:6px solid #ffd43b"><tr><td align="center" style="padding:28px 22px 10px"><div style="font-size:52px;line-height:1;font-weight:900">Congratulations${greeting}!</div><div style="margin-top:12px;font-size:18px;font-weight:700">Your Wifi Digital System purchase is complete.</div></td></tr><tr><td style="padding:8px 22px"><div style="padding:13px;border:3px solid #ffd43b;border-radius:12px;background:#fff;color:#081b61;text-align:center;font-size:17px;font-weight:900">FOR REFUNDS PLEASE EMAIL<br><a href="mailto:support@kairostechnologylabs.com" style="color:#081b61">SUPPORT@KAIROSTECHNOLOGYLABS.COM</a></div></td></tr><tr><td style="padding:4px 22px"><div style="padding:13px;border:2px solid #fff;border-radius:10px;background:#b91c1c;text-align:center;font-size:15px;line-height:1.25;font-weight:900">DO NOT FILE A DISPUTE. THEN WE ARE FORCED TO FIGHT THE DISPUTE, WHICH CAN OFTEN LEAD TO YOU LOSING. CALL US FOR A NO-QUESTIONS-ASKED REFUND.</div></td></tr><tr><td align="center" style="padding:18px 22px 8px"><div style="font-size:28px;font-weight:900">CALL OUR OFFICE NOW TO GET STARTED</div><a href="tel:+12067032153" style="display:inline-block;margin-top:12px;padding:14px 24px;border-radius:12px;background:#22c55e;color:#fff;text-decoration:none;font-size:34px;font-weight:900">(206) 703-2153</a></td></tr><tr><td style="padding:12px 22px 8px"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td width="50%" style="padding:5px"><a href="https://cal.com/jon19/wificode-onboarding" style="display:block;padding:17px 8px;border-radius:10px;background:#7c3aed;color:#fff;text-align:center;text-decoration:none;font-size:19px;font-weight:900">SCHEDULE ONBOARDING</a></td><td width="50%" style="padding:5px"><a href="https://www.digitalwifi.dev/member-login" style="display:block;padding:17px 8px;border-radius:10px;background:#ef1d24;color:#fff;text-align:center;text-decoration:none;font-size:19px;font-weight:900">CREATE YOUR ACCOUNT</a></td></tr></table></td></tr><tr><td align="center" style="padding:8px 22px 28px"><a href="https://www.digitalwifi.dev/thankyou" style="display:inline-block;color:#fff;text-decoration:underline;font-size:16px;font-weight:700">View your complete thank-you page</a></td></tr></table></td></tr></table></body></html>`;
};

export async function sendPurchaseEmail(lead,transactionId) {
  if(!lead?.email||!transactionId)return false;
  const subject='Congratulations — Your Wifi Digital System Access Is Ready',html=purchaseEmailHtml(lead),dedupeKey=`purchase-welcome:${transactionId}`;
  const message=(await run(`INSERT INTO messages(lead_id,channel,recipient,subject,body,status,scheduled_at,created_at,dedupe_key) VALUES($1,'transactional_email',$2,$3,$4,'scheduled',NOW(),NOW(),$5) ON CONFLICT(dedupe_key) WHERE dedupe_key<>'' DO NOTHING RETURNING *`,[lead.id,lead.email,subject,html,dedupeKey]))[0];
  if(!message)return false;
  try{
    if(!process.env.RESEND_API_KEY||!process.env.EMAIL_FROM)throw Error('Resend is not configured');
    const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{authorization:`Bearer ${process.env.RESEND_API_KEY}`,'content-type':'application/json'},body:JSON.stringify({from:process.env.EMAIL_FROM,to:[lead.email],subject,html})}),data=await response.json();
    if(!response.ok)throw Error(data.message||`Resend HTTP ${response.status}`);
    await run("UPDATE messages SET status='sent',provider_id=$1,sent_at=NOW(),error='' WHERE id=$2",[data.id||'',message.id]);
    return true;
  }catch(error){
    await run("UPDATE messages SET status='failed',error=$1 WHERE id=$2",[String(error.message).slice(0,500),message.id]);
    console.error('Purchase email failed',error.message);
    return false;
  }
}

async function sendEmail(message, lead) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) throw new Error('Resend is not configured');
  const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: {
    authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'content-type': 'application/json'
  }, body: JSON.stringify({ from: process.env.EMAIL_FROM, to: [message.recipient], subject: interpolate(message.subject, lead),
    html: `<div style="font-family:Arial,sans-serif;white-space:pre-wrap">${interpolate(message.body, lead).replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}</div><p style="margin-top:28px;font:12px Arial,sans-serif;color:#667085"><a href="${process.env.PUBLIC_APP_URL}/api/unsubscribe?email=${encodeURIComponent(message.recipient)}&token=${createHmac('sha256',process.env.SESSION_SECRET||process.env.CRON_SECRET).update(message.recipient.toLowerCase()).digest('base64url')}">Unsubscribe</a></p>`,headers:{'List-Unsubscribe':`<${process.env.PUBLIC_APP_URL}/api/unsubscribe?email=${encodeURIComponent(message.recipient)}&token=${createHmac('sha256',process.env.SESSION_SECRET||process.env.CRON_SECRET).update(message.recipient.toLowerCase()).digest('base64url')}>`,'List-Unsubscribe-Post':'List-Unsubscribe=One-Click'} }) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || `Resend HTTP ${response.status}`);
  return data.id;
}

async function sendSms(message, lead) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token || !process.env.TWILIO_FROM) throw new Error('Twilio is not configured');
  const form = new URLSearchParams({ To: message.recipient, From: process.env.TWILIO_FROM, Body: interpolate(message.body, lead) });
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, { method: 'POST',
    headers: { authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`, 'content-type': 'application/x-www-form-urlencoded' }, body: form });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || `Twilio HTTP ${response.status}`);
  return data.sid;
}

export async function processDueMessages() {
  await run("UPDATE messages SET status='scheduled',error='' WHERE status='failed' AND error ILIKE '%rate%'");
  await run("UPDATE messages SET status='scheduled',scheduled_at=date_trunc('day',NOW())+interval '1 day 5 minutes' WHERE status='failed' AND error ILIKE '%daily email sending quota%'");
  const due = await many(`SELECT m.*,l.first_name,l.last_name,l.email,l.phone,l.unsubscribed,l.email_consent,l.sms_consent
    FROM messages m JOIN leads l ON l.id=m.lead_id WHERE m.status='scheduled' AND m.scheduled_at<=$1 LIMIT 20`,[new Date().toISOString()]);
  for (const message of due) {
    const allowed = !message.unsubscribed && (message.channel === 'sms' ? message.sms_consent : message.email_consent);
    if (!allowed) { await run("UPDATE messages SET status='cancelled',error='Consent withdrawn' WHERE id=$1",[message.id]); continue; }
    try {
      if(message.channel==='email')await new Promise(resolve=>setTimeout(resolve,600));
      const providerId = message.channel === 'sms' ? await sendSms(message, message) : await sendEmail(message, message);
      await run("UPDATE messages SET status='sent',provider_id=$1,sent_at=$2 WHERE id=$3",[providerId,new Date().toISOString(),message.id]);
    } catch (error) {
      const detail=String(error.message).slice(0,500);
      if(detail.toLowerCase().includes('daily email sending quota'))await run("UPDATE messages SET status='scheduled',scheduled_at=date_trunc('day',NOW())+interval '1 day 5 minutes',error=$1 WHERE id=$2",[detail,message.id]);
      else await run("UPDATE messages SET status='failed',error=$1 WHERE id=$2",[detail,message.id]);
    }
  }
  return due.length;
}
