# Turni Casa

App per la rotazione settimanale delle pulizie tra **Gloria**, **Sofia** ed **Elisa**.

## Zone

1. Salone 1 + corridoio  
2. Bagni + cucina  
3. Salone 2 + corridoio  

Ogni settimana le assegnazioni ruotano di una zona. L’ancora della rotazione è la settimana **5–11 ottobre 2026**.

## Avvio

```bash
npm install
npm run dev -- --port 43127
```

Apri [http://127.0.0.1:43127](http://127.0.0.1:43127).

## Funzioni

- Vista della settimana corrente con le tre assegnazioni  
- Navigazione avanti/indietro tra le settimane  
- Anteprima delle prossime tre settimane  
- Checkbox “fatto” salvata in `localStorage` su questo dispositivo  
