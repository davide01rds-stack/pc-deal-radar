const headers={
  'content-type':'text/html; charset=utf-8',
  'cache-control':'no-store',
  'x-content-type-options':'nosniff',
  'content-security-policy':"default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'"
};
function page(message,status=200){const html=`<!doctype html><html lang="it"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PC Deal Radar · Telegram</title><style>body{font:16px system-ui;max-width:520px;margin:12vh auto;padding:24px;line-height:1.5}button{padding:14px 20px;border:0;border-radius:10px;background:#1877e8;color:white;font-weight:600;font-size:16px}p{color:#333}</style><h1>PC Deal Radar</h1><p>${message}</p>${status===200?'<form method="POST" action="/connect"><button type="submit">Collega il bot Telegram</button></form>':''}<p>Il servizio non acquista PC e non abilita servizi a pagamento.</p></html>`;return new Response(html,{status,headers});}
export async function connectTelegram(request,env,remoteFetch=fetch){
  if(request.method==='GET')return page('Collega il bot al Worker. Le credenziali rimangono nei Secrets di Cloudflare.');
  if(request.method!=='POST')return new Response('Method not allowed',{status:405,headers:{allow:'GET, POST'}});
  const url=new URL(request.url);
  const origin=request.headers.get('origin');
  if(origin && origin!==url.origin)return page('Richiesta non autorizzata.',403);
  if(url.protocol!=='https:'||!url.hostname.endsWith('.workers.dev'))return page('Apri la pagina dall’indirizzo pubblico workers.dev.',400);
  if(!env.TELEGRAM_BOT_TOKEN||!env.TELEGRAM_CHAT_ID||!env.TELEGRAM_WEBHOOK_SECRET||!env.DB)return page('Configurazione incompleta: verifica i tre Secrets e il binding D1.',503);
  if(!/^[a-zA-Z0-9_-]{16,256}$/.test(env.TELEGRAM_WEBHOOK_SECRET))return page('Il Webhook Secret deve avere almeno 16 caratteri: lettere, numeri, _ e -.',503);
  try {
    const table=await env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='offers'").first();
    if(!table)return page('La tabella offers non esiste nel database D1 collegato al Worker.',503);
    const response=await remoteFetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/setWebhook`,{
      method:'POST',headers:{'content-type':'application/json'},
      body:JSON.stringify({url:url.origin+'/telegram',secret_token:env.TELEGRAM_WEBHOOK_SECRET,max_connections:1,allowed_updates:['message'],drop_pending_updates:true})
    });
    if(!response.ok)return page('Telegram ha rifiutato il collegamento. Controlla il Bot Token.',502);
    const result=await response.json();
    if(result.ok!==true||result.result!==true)return page('Telegram non ha confermato il collegamento. Controlla il Bot Token.',502);
    return page('Bot collegato correttamente! Apri la sua chat Telegram e invia /stato.');
  }catch{return page('Errore di comunicazione o database. Riprova e controlla gli errori nel Worker.',503);}
}