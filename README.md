# PC Deal Radar — Cloud Free Edition (v0.6)

Bot Telegram per cercare e valutare **PC desktop preassemblati nuovi** entro **1.400 € tutto incluso**, con GPU NVIDIA CUDA e **almeno 12 GB VRAM**. Budget ideale **1.100 €**.

## Stato del progetto
- Codice serverless per **Cloudflare Workers Free + D1 Free**; utente finale **solo Telegram da smartphone**.
- Registro multi-store IT/EU, filtro URL sicuro, scoring deterministico, archivio per offerte da verificare.
- Comandi: `/stato`, `/negozi`, `/offerte`, `/migliori`, `/aggiungi URL`, `/help`.
- **Non ancora distribuito**: servono un account Cloudflare Free, D1, un bot Telegram e segreti privati.
- **Nessun connettore negozio in produzione**: 24 domini in elenco ≠ 24 negozi monitorati. Il caricamento di un link NON rappresenta una verifica.
- **Nessuna esecuzione programmata o API prezzi a pagamento** è attiva.

## Zero costi
Nessun servizio a pagamento né API IA a consumo, VPS, proxy, Keepa a pagamento o abbonamento. Niente GitHub Actions schedulate nel repository privato. Sul piano Cloudflare Free le quote si bloccano al raggiungimento dei limiti, invece di richiedere l'upgrade.

## Configurazione (assistita; niente Python sul proprio PC)
1. Crea un account **Cloudflare Free** e un database D1 gratuito chiamato `pc-deal-radar-free`.
2. Collega questo repository a un Worker Cloudflare; sostituisci `REPLACE_WITH_FREE_D1_DATABASE_ID` nel file `wrangler.jsonc` con l'ID reale.
3. Esegui la migrazione `migrations/0001_init.sql` sul database D1.
4. Crea un bot con Telegram **@BotFather** e avvia una chat privata.
5. Aggiungi ai **Worker Secrets**, non nel repository: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `TELEGRAM_WEBHOOK_SECRET`.
6. Registra l'URL HTTPS del Worker `/telegram` con `setWebhook` della Telegram Bot API, usando il medesimo `secret_token`.
7. Prova `/stato` e `/aggiungi https://www.amazon.de/...`.

Il deploy non può essere completato unicamente con GitHub: richiede un account Cloudflare e i segreti Telegram. I segreti **non devono mai essere inviati in chat né pubblicati**.

## Sviluppo
`node --test` esegue i test senza connessione e senza dipendenze a pagamento.

## Roadmap
1. Attivare D1/Worker/Telegram e verificare webhook reale.
2. Integrare uno alla volta negozi con feed/API leciti e gratuiti, verificando titolo, SKU, prezzo finale, spedizione in Italia e venditore.
3. Aggiungere fonti indipendenti e verificabili per benchmark, approvazione e notifiche deduplicate.
4. Abilitare un cron moderato **solo dopo** un connettore validato, entro quota Free.
5. Amazon DE/ES/IT: non presumere la disponibilità della Creators API; servono ammissibilità, permessi e rispetto della licenza.

I risultati in lista `pending` non sono raccomandazioni d'acquisto. Il motore non attribuisce voti da caratteristiche inventate.