# PC Deal Radar — attivazione Cloudflare dal telefono (nessuna installazione Python)

Questa guida riguarda SOLO il backend Telegram. Non significa che il radar stia già monitorando negozi o inviando offerte reali.

## Fase 1 — Account e database, senza API a pagamento
1. Accedere a https://dash.cloudflare.com e verificare di essere sul piano Workers **Free**.
2. Nel menu Cloudflare cercare **D1** (Storage & databases → D1 SQL database), creare il database `pc-deal-radar-free`.
3. Copiare l'**ID del database D1 (UUID)**. L'ID non è una password: può essere comunicato per aggiornare `wrangler.jsonc` nel repository senza rivelare credenziali. Non inviare screenshot contenenti token o altri dati sensibili.
4. Il file `wrangler.jsonc` deve contenere questo ID reale al posto di `REPLACE_WITH_FREE_D1_DATABASE_ID`, altrimenti la prima build fallirà.
5. Nel database D1, dalla sua interfaccia SQL/Console, applicare una volta la migrazione del repository `migrations/0001_init.sql`. Non è necessario scrivere manualmente il codice: si copia il contenuto del file già predisposto.

## Fase 2 — Worker collegato a GitHub
1. Cloudflare → **Workers & Pages → Create application → GitHub**.
2. Autorizzare **solo** il repository `davide01rds-stack/pc-deal-radar` quando possibile, anziché concedere accesso a tutti i repository.
3. Scegliere il branch `main`; nome Worker `pc-deal-radar` (come in `wrangler.jsonc`).
4. Build command: `node --test` (esegue la piccola suite offline prima del deploy).
5. Deploy command: `npx wrangler deploy`.
6. Controllare nella schermata prima di confermare che il piano sia **Free** e che non venga richiesto un upgrade a pagamento. Confermare il deploy dopo che l'ID D1 è stato inserito.
7. Salvare l'indirizzo del Worker del tipo `https://pc-deal-radar.<subdomain>.workers.dev`. La rotta `/health` deve restituire un JSON con `ok:true`.

Cloudflare Workers Builds Free ha una quota distinta da GitHub Actions. Evitare deploy automatici inutili quando il progetto è in sviluppo.

## Fase 3 — Telegram
1. Aprire @BotFather in Telegram, creare un bot con /newbot. Non condividere il token in chat o su GitHub.
2. Ottenere l'ID della chat privata Telegram e generare un segreto casuale forte per il webhook. Non condividere questi valori pubblicamente.
3. Nel Worker Cloudflare → Settings → Variables and Secrets aggiungere come tipo **Secret**:
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
   - `TELEGRAM_WEBHOOK_SECRET`
4. Dopo il deploy, registrare il webhook tramite la Telegram Bot API con URL `https://<worker-url>/telegram` e `secret_token` coincidente con il secret del Worker. Evitare link contenenti il token in messaggi, screenshot o repository.
5. Inviare `/stato`, `/negozi` e `/help` al bot: questi non richiedono alcun connettore a negozi attivo.

## Stato reale dopo l'attivazione
- Il bot permette di salvare i link e vedere uno stato; **non analizza ancora realmente i prezzi dai siti**.
- `/migliori` non mostrerà offerte verificate finché non saranno implementati connettori leciti e controlli indipendenti.
- Nessun sistema di acquisto automatico e nessuna spesa a pagamento.
- Se le quote gratuite terminano, la funzionalità può sospendersi.

## Punti delicati
- Non copiare mai token Telegram o Cloudflare in GitHub, issue, README o chat.
- L'ID del database D1 è diverso dalle credenziali: può essere inserito nel repository.
- La visibilità pubblica GitHub non rende pubblici i Cloudflare Worker Secrets o il database D1.
- Accesso diretto all'account Cloudflare non è disponibile nell'integrazione GitHub: la connessione iniziale del tuo account va autorizzata dall'interfaccia Cloudflare.

Riferimenti:
- https://developers.cloudflare.com/workers/ci-cd/builds/
- https://developers.cloudflare.com/workers/configuration/secrets/
- https://developers.cloudflare.com/d1/reference/migrations/
