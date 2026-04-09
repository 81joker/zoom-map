# Zoom Map Demo Project
Technical assignment implementation for Zooom Productions

## Tech Stack

- React
- TypeScript
- Vite
- npm
- Leaflet + React-Leaflet (OpenStreetMap)

## Getting Started

```bash
npm install
npm run dev
```

### Build & Preview

```bash
npm run build
npm run preview
```

## Implemented Features

- Local JSON dataset with required fields:
  - `title`, `description`, `address`, `country`, `coordinates`, `category`
- Map + list from the same data source
- Category filter: `All / A / B`
- Hover sync on desktop:
  - list item -> marker highlight
  - marker -> list item highlight
- Click sync:
  - selecting list item or marker highlights the same event
  - map recenters on selected event
- Marker popup with `title` and `description`
- Basic UI states:
  - loading
  - empty
  - error
- Responsive layout improvements for smaller screens

## Project Structure

- `src/App.tsx` - layout and UI state management
- `src/components/MapView.tsx` - map rendering and marker interactions
- `src/data/events.json` - static dataset
- `src/types/event.ts` - data model types

## Technical Decisions

- React + TypeScript for maintainable, typed UI logic.
- Static JSON chosen for speed and simplicity within assignment time.
- Single source of truth for map/list consistency.
- React-Leaflet selected as a lightweight map integration.
- Separate states for filter, hover, and selection for predictable behavior.

## Improvements With More Time

- Add unit/integration tests for filter and interaction logic.
- Improve accessibility (keyboard support and ARIA).
- Add optional location search (geocoding).
- Add marker clustering for larger datasets.
- Replace static JSON with a minimal API layer.

## Notes

- The implementation focuses on clarity, simplicity, and maintainability.
- No unnecessary features were added to avoid over-engineering.