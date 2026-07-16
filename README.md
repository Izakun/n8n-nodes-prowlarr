<img src="nodes/Prowlarr/prowlarr.svg" width="90" align="right" alt="Prowlarr" />

# n8n-nodes-prowlarr

[![npm version](https://img.shields.io/npm/v/n8n-nodes-prowlarr.svg)](https://www.npmjs.com/package/n8n-nodes-prowlarr)
[![License: MIT](https://img.shields.io/npm/l/n8n-nodes-prowlarr.svg)](./LICENSE)

Community node for n8n to manage a [Prowlarr](https://prowlarr.com/) indexer manager
through its **v1 API**.

## Installation

In n8n: **Settings → Community Nodes → Install** and enter `n8n-nodes-prowlarr`.

## Resources & operations

| Resource | Operations |
|---|---|
| **Search** | Search across indexers (query, type, categories, indexer IDs) |
| **Indexer** | Get Many, Get |
| **Command** | Trigger (e.g. `ApplicationIndexerSync`, `IndexerHealthCheck`) |
| **System** | Get Status, Get Health |

## Credentials

Create a **Prowlarr API** credential:
- **Base URL** — e.g. `http://prowlarr:9696`.
- **API Key** — Prowlarr → Settings → General → Security → API Key. Sent as `X-Api-Key`.

## Build

```bash
npm install --ignore-scripts
npm run build
```

## Disclaimer

This project isn't affiliated with or endorsed by the Prowlarr project. Prowlarr is the
property of its respective authors.
