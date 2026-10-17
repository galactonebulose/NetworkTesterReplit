# Network Test Monitor

A single-page dashboard for tracking network test results, latency, packet loss, and test status. The monitor is built for a quick read of network health and includes editable in-memory test data, dynamic summary metrics, search, and status filtering.

## Getting started

From the project root, install dependencies and start the web app:

```bash
pnpm install
pnpm --filter @workspace/network-test-monitor run dev
```

The app is served through the Replit preview.

## Features

- **Dashboard overview:** Total, passed, and failed test counts plus average latency. Metrics are derived from the full test list, including tests marked Running.
- **Test management:** Starts with sample 4G, 5G, and Wi-Fi tests. Add a test with its name, network type, latency, packet loss, and status, or delete an existing test.
- **Input validation:** Requires a non-whitespace name, valid network and status selections, non-negative latency, and packet loss from 0% to 100%. Blank numeric values are rejected; zero is allowed.
- **Search and filtering:** Search by test name without regard to letter case and combine the search with a status filter.
- **Responsive layout:** Controls remain usable on small screens, and the results table can scroll horizontally when needed.
- **Empty states:** Distinguishes between an empty test list and filters with no matching results.

## Technology

- React with Vite
- JavaScript and plain CSS
- React state for all test data and UI interactions
- No database, backend, authentication, or client-side routing

## Project structure

- `artifacts/network-test-monitor/` — the Network Test Monitor web application.
- `artifacts/api-server/` — shared API service scaffold; the monitor does not depend on it.
- `artifacts/mockup-sandbox/` — reusable component-preview/design workspace.
- `lib/` — shared workspace libraries and API/database scaffolding.

The monitor's test list exists only in the current browser session. Refreshing the page restores the initial sample tests.
