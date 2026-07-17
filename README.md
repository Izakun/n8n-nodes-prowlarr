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

## Usage example

**Search all indexers for a release**

1. Add the **Prowlarr** node after a trigger (e.g. *When clicking 'Test workflow'*).
2. Select your **Prowlarr API** credential.
3. Set **Resource** = *Search*, **Operation** = *Search*, **Query** = `ubuntu`
   (optionally narrow with *Type*, *Categories* or *Indexer IDs*).
4. Execute the node. Each result comes back as its own item, e.g.:

```json
{
  "guid": "1337x-9c1f...",
  "title": "ubuntu-24.04.1-desktop-amd64.iso",
  "indexer": "1337x",
  "indexerId": 3,
  "size": 6114887290,
  "seeders": 128,
  "leechers": 4,
  "downloadUrl": "http://prowlarr:9696/1/download?apikey=***&link=...",
  "infoUrl": "https://1337x.to/torrent/...",
  "publishDate": "2026-07-10T12:00:00Z"
}
```

Typical follow-up: filter items by `seeders`, then pass `downloadUrl` to a
download-client node (qBittorrent, SABnzbd, …) to grab the release automatically.

## Build

```bash
npm install --ignore-scripts
npm run build
```

## Disclaimer

This project isn't affiliated with or endorsed by the Prowlarr project. Prowlarr is the
property of its respective authors.
