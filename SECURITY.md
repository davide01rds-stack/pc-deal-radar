# Security Policy — PC Deal Radar

Questo repository può essere pubblico; **nessun token o dato personale** deve essere commitato.

## Segreti
Usare solo Worker Secrets per `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `TELEGRAM_WEBHOOK_SECRET` e future chiavi di accesso. Non utilizzare variabili plain-text per i valori sensibili.

Prima di abilitare una integrazione:
- nessun accesso ai dati Telegram da chat diverse da quella autorizzata;
- nessuna registrazione delle credenziali nei log;
- URL e contenuti di terzi considerati non attendibili;
- nessuna approvazione automatica di offerte non indipendentemente verificate;
- niente servizi cloud o API a pagamento;
- nessun endpoint amministrativo pubblico e non autenticato.

Se un secret finisse accidentalmente in un commit, revocarlo/ruotarlo presso il provider **immediatamente**: cancellare il file non elimina la cronologia.

Segnalare eventuali vulnerabilità tramite i canali privati del proprietario del repository, senza inserire token o exploit nelle issue pubbliche.
