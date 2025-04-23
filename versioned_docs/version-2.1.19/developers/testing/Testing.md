---
id: testing
title: Testing
---

import MerryTitle from "./Title";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Localnet testing is a crucial step in ensuring your Garden SDK integration works as intended before deploying it to a testnet or mainnet. To support your testing, we provide **Merry**, an in-house tool designed for comprehensive cross-chain testing in a local environment.

## <MerryTitle />

Merry is a CLI tool that leverages Docker to set up a multi-chain testing environment with a single command. It includes:

- **Bitcoin regtest node:** A local Bitcoin testnet environment.
- **EVM localnet nodes:** Local Ethereum and Arbitrum test environments. Simply add the localnet details to your EVM wallet to detect and interact.
- **Filler bot:** Simulates the behavior of a live [solver](Solvers.md) based on predefined strategies.
- **Orderbook:** Local version of the [order book](Auctions.md) to test how intents are matched and fulfilled.
- **Faucet:** Generate unlimited test funds for seamless testing.
- **Electrum services:** Lightweight wallet support for interacting with Bitcoin network.

Merry eliminates block mining delays, provides a complete environment for multi-chain workflows, and allows developers to test integrations independently of external services. It’s customizable, fast, and supports iterative testing with features like local service replacement. 

## Installation

### Prerequisites
- Ensure Docker is installed and running. Download Docker from [here](https://www.docker.com).
- Merry supports arm64 and amd64 architectures. For Windows, use Windows Subsystem for Linux (WSL).

Run these srcipts based on your environment.

<Tabs>
<TabItem value="unix" label="Linux & MacOS" default>
Run the following command to install Merry:

```bash
curl https://get.merry.dev | bash
```

</TabItem>
<TabItem value="windows" label="Windows">
In a WSL terminal, run `sudo dockerd` and verify if the docker daemon is running, then:

```bash
curl https://get.merry.dev | bash
```

</TabItem>
</Tabs>

Merry stores its configuration and other data in a `.merry` directory on your system.

## Commands

Merry provides a variety of commands to manage your testing environment.

### Start Merry

Start all services with:

```bash
merry go
```

Optional flags:

- `--bare`: Starts multi-chain services only (Bitcoin and Ethereum nodes with explorers) without Garden services.

- `--headless`: Starts all services without frontend interfaces for server environments.

### Stop Merry

Stops all running services with:

```bash
merry stop
```
 Use `--delete` or `-d` to remove data.
```bash
merry stop -d
```

### List all commands

Display all available commands:
```bash
merry --help
```

### Get logs

Access logs for specific [services](#supported-services) using:
```bash
merry logs -s <service>
```

Replace \<service> with the specific service (e.g., filler, orderbook) to view its logs.

```bash
merry logs -s evm
```

### Replace a service with local version

Replace a service with your local development version using:
```bash
merry replace <service>
```

Make sure you're in the directory containing the local service's Dockerfile. You can only replace filler, orderbook, and EVM chain services.

### Interact with Bitcoin RPC

Run Bitcoin RPC [commands](https://developer.bitcoin.org/reference/rpc/) directly:
```bash
merry rpc <method> <params>
```
Here's an example to get blockchain info.
```bash
merry rpc getblockchaininfo
```

### Fund accounts
Use the faucet to fund Bitcoin or Ethereum addresses for testing:
```bash
merry faucet --to <address>
```

### Update Docker images
Keep your environment up-to-date by pulling the latest Docker images:
```bash
merry update
```

### Generate auto-completion scripts
Generate scripts for your shell (bash, zsh, fish, powershell):
```bash
merry completion <shell>
```

### Get version info
Check the version of Merry installed:
```bash
merry version
```

## Supported services

| Service                         | Port                    |
| ------------------------------- | ----------------------- |
| Bitcoin regtest node            | localhost:18443 & 18444 |
| Bitcoin esplora frontend        | localhost:5050          |
| Bitcoin esplora electrs indexer | localhost:50000 & 30000 |
| Ethereum localnode              | localhost:8545          |
| Ethereum otterscan              | localhost:5100          |
| Arbitrum localnode              | localhost:8546          |
| Arbitrum otterscan              | localhost:5101          |
| Postgres                        | localhost:5432          |
| Redis                           | localhost:6379          |
| Orderbook                       | localhost:8080          |
| Filler                          | -                       |
