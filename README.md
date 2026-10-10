# Turni Casa

App per la rotazione settimanale delle pulizie tra **Gloria**, **Sofia** ed **Elisa**.

## Zone

1. Salone 1 + corridoio  
2. Bagni + cucina  
3. Salone 2 + corridoio  

Ogni settimana le assegnazioni ruotano di una zona. L’ancora della rotazione è la settimana **5–11 ottobre 2026**.

## Avvio locale

```bash
npm install
npm run dev
```

Apri [http://127.0.0.1:43127](http://127.0.0.1:43127).

## Pubblicare su Vercel (condividere il link)

1. Metti il codice su un repo GitHub del tuo account personale.
2. Vai su [vercel.com](https://vercel.com) → **Continue with Google** (`gloriazanini96@gmail.com`).
3. **Add New… → Project** → importa il repo → **Deploy**.
4. Copia l’URL (es. `https://turni-casa.vercel.app`) e mandalo alle coinquiline.

## Funzioni

- Vista della settimana corrente con le tre assegnazioni  
- Navigazione avanti/indietro tra le settimane  
- Anteprima delle prossime tre settimane  
- Checkbox “fatto” salvata in `localStorage` su questo dispositivo  
