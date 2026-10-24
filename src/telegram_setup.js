const HEADERS={
 'content-type':'text/html; charset=utf-8',
 'cache-control':'no-store',
 'referrer-policy':'no-referrer',
 'x-content-type-options':'nosniff',
 'x-frame-options':'DENY',
 'content-security-policy':"default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'"
};
function page(message,status=200,form=false){
 const field=form?'<form method="POST" action="/connect" autocomplete="off"><label for="code">Inserisci il TELEGRAM_WEBHOOK_SECRET salvato su Cloudflare</label><input id="code" name="verification" type="password" autocomplete="off" required minlength="16" maxlength="256" spellcheck="false"><button type="submit">Collega Telegram</button></form>':'';
 const html='<!doctype html><html lang="it"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>PC Deal Radar - Telegram</title><style>body{font:16px system-ui;max-width:520px;margin:8vh auto;padding:20px;line-height:1.5}form{display:grid;gap:14px}input{font-size:16px;padding:12px}button{padding:14px;background:#2760dc;color:white;border:0;border-radius:9px}small{color:#555}</style><h1>PC Deal Radar</h1><p>'+message+'</p>'+field+'<p><small>Il token del bot resta su Cloudflare. Non inviare le credenziali in chat o su GitHub.</small></p>';
 return new Response(html,{status,headers:HEADERS});
}
export async function registerTelegram(request,env,httpFetch=fetch){
 const u=new URL(request.url);
 if(request.method==='GET')return page('Attivazione protetta sul tuo Worker Cloudflare.',200,true);
 if(request.method!=='POST')return new Response('Method not allowed',{status:405,headers:{allow:'GET, POST'}});
 if(u.protocol!=='https:'||!u.hostname.endsWith('.workers.dev'))return page('Apri il dominio workers.dev del tuo Worker.',400);
 if(request.headers.get('origin')!==u.origin)return page('Richiesta non autorizzata.',403);
 if(!request.headers.get('content-type')?.startsWith('application/x-www-form-urlencoded'))return page('Formato richiesta non consentito.',415);
 if(Number(request.headers.get('content-length')||0)>2048)return page('Richiesta troppo lunga.',413);
 const body=await request.text();
 if(body.length>2048)return page('Richiesta troppo lunga.',413);
 if(!env?.DB||!env.TELEGRAM_BOT_TOKEN||!env.TELEGRAM_CHAT_ID||!env.TELEGRAM_WEBHOOK_SECRET)return page('Configurazione incompleta: controlla i tre Secrets e il database D1.',503);
 const secret=env.TELEGRAM_WEBHOOK_SECRET;
 if(!/^[A-Za-z0-9_-]{16,256}$/.test(secret))return page('Formato del Webhook Secret non valido.',503);
 if(new URLSearchParams(body).get('verification')!==secret)return page('Il Secret non corrisponde a quello di Cloudflare.',403);
 try{
  const row=await env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='offers'").first();
  if(!row)return page('Tabella offers assente nel database D1 associato al Worker.',503);
  const response=await httpFetch('https://api.telegram.org/bot'+env.TELEGRAM_BOT_TOKEN+'/setWebhook',{
   method:'POST',headers:{'content-type':'application/json'},
   body:JSON.stringify({url:u.origin+'/telegram',secret_token:secret,allowed_updates:['message'],max_connections:1,drop_pending_updates:false})
  });
  if(!response.ok)return page('Telegram ha rifiutato la richiesta: verifica il token su Cloudflare.',502);
  const result=await response.json();
  if(result.ok!==true||result.result!==true)return page('Telegram non ha confermato il collegamento.',502);
  return page('Bot collegato! Apri Telegram e invia /stato alla chat del tuo bot.');
 }catch{return page('Collegamento non riuscito: verifica database e Secrets su Cloudflare.',503);}
}