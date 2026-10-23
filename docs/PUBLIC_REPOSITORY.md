# Rendere pubblico PC Deal Radar senza costi e senza credenziali esposte

## Quando conviene
- GitHub Actions sui **runner standard** per repository pubblici non consuma i minuti inclusi per i repository privati.
- Questa scelta **non riduce** i minuti consumati dagli altri repository privati dell'account.
- L'app funzionerà su Cloudflare Workers, non su GitHub Actions: quindi pubblicare il repository non è necessario per avere il bot online.
- Cloudflare Workers Builds Free ha una propria quota di build mensili, distinta da GitHub Actions.

## Controlli prima di cambiare visibilità
1. Verificare sia file correnti sia cronologia dei commit: niente TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET, cloudflare API token, .env, .dev.vars, chat ID personali o credenziali.
2. I segreti del bot devono stare in **Cloudflare > Worker > Settings > Variables and Secrets**, tipo Secret. Non vanno nei file versionati, in README, nelle issue né nei log.
3. La cartella `.github/workflows`, se introdotta, dovrà usare soltanto runner standard e permessi minimi. Vietati larger runners e servizi a pagamento.
4. Il database Cloudflare D1 resta privato e non deve essere esportato/pubblicato nel repository.
5. Prima di introdurre connettori terzi, valutare termini d'uso e privacy dei negozi.

## Operazione da smartphone
Aprire https://github.com/davide01rds-stack/pc-deal-radar/settings
Settings → General → Danger Zone → Change repository visibility → Public.
La modifica della visibilità richiede l'azione del proprietario GitHub.

Riferimenti ufficiali:
- https://docs.github.com/en/billing/concepts/product-billing/github-actions
- https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility
- https://developers.cloudflare.com/workers/ci-cd/builds/limits-and-pricing/
