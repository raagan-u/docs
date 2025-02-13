---
id: overview
---

# Overview

Garden was built with the purpose of enabling Bitcoin in DeFi as seamlessly as possible. To achieve this, we’ve designed Garden to be easy to integrate into any wallet, aggregator, or dApp, empowering developers to unlock Bitcoin’s potential in their products.

## What does Garden unlock?

Traditionally, cross-chain flows require users to manually bridge their Bitcoin before using those funds in dApps. Garden simplifies this with an [SDK](./sdk/Sdk.md) and [API](./api/GardenAPI.md) that abstracts the bridging process, letting users directly utilize Bitcoin within DeFi ecosystems. Here's what Garden can enable:

- Access to Bitcoin’s existing liquidity, seamlessly integrated into your product or chain.
- A native Bitcoin experience for users, free from bridging complexities.
- Customizable SDK and API tools designed to fit your unique use case.

## Choosing between SDK and API

Choosing between Garden’s [SDK](./sdk/Sdk.md) and [API](./api/GardenAPI.md) depends on your project’s requirements and technical expertise:

### SDK

Garden SDK is a customizable API wrapper tailored for React and Node-based dApps. It simplifies integration with a plug-and-play approach, requiring minimal setup. This is ideal for developers seeking a quick and efficient way to integrate Bitcoin swaps with minimal setup. Check out the quick start guides for [React](./sdk/react/Quickstart.mdx) and [Node](./sdk/nodejs/Quickstart.md) to get an understanding.

### API

Garden APIs are designed for broader application environments, such as wallets, mobile apps, or implementations in Rust, Go, or other programming languages. While highly flexible, it requires more development effort, making it perfect for advanced workflows. Begin with exploring the [API](./api/GardenAPI.md).

| **Feature**            | **SDK**                     | **API**                              |
|-------------------------|-----------------------------|--------------------------------------|
| **Integration speed**   | Quick and simple            | Requires more effort and expertise   |
| **Best for**            | React, Node-based dApps     | Wallets, mobile apps, diverse setups |
| **Recommended use cases** | Standard swaps in existing products | Advanced workflows and unique environments |

## How to get started

Before diving into full-fledged development, familiarize yourself with the [fundamentals](../home/fundamentals/introduction/Introduction.md) and the [intent flow](../home/fundamentals/how-it-works/IntentFlow.md) as you explore the quick start guides shared above.

For more in-depth examples, explore the [Cookbook](./cookbook/Cookbook.md) (coming soon!).
