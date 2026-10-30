# My Moves – Packers & Movers (React)

Consumes `https://apis2.ccbp.in/packers-and-movers/packers-and-movers-details` and renders the
"My Moves" list with expandable move details and inventory.

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
```

## Features
- **Step 1** – list of moves: from/to, request #, BHK, items, distance, move date (editable), flexible checkbox,
  disclaimer, "View move details" and "Quotes Awaiting".
- **Step 2** – "View move details" expands/collapses a panel with Additional Information, House Details
  (existing/new) and Inventory Details loaded from the `items` object; each inventory category is its own accordion
  with an item-count badge.
- Loading, error + retry states, and a "Use sample data" fallback if the API is unreachable.
- Responsive (sidebar becomes a top bar on mobile), keyboard accessible (`aria-expanded`, focus rings).

## Structure
```
src/
  api.js                 fetch + defensive normalizer (tolerates different key names)
  sampleData.js, sample.js   offline fallback
  App.jsx                data loading + states
  components/
    Sidebar.jsx  MoveCard.jsx  MoveDetails.jsx
  styles.css
```
If the live response uses different key names, adjust the key lists in `normalizeMove` in `src/api.js`.
