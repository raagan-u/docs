---
id: get-order
---

# Get order  

Tracking the status of swaps is crucial for providing users with real-time updates about their transactions. The SDK provides tools to monitor and fetch details of orders efficiently.

You can fetch the transaction history and statuses directly using the `orderBook` instance.

```typescript
fetchOrders(
  matched: T,
  pending: boolean,
  paginationOptions: {
    page: number;
    per_page: number;
  }
) => {
  data: T[];
  page: number;
  total_pages: number;
  total_items: number;
}
```

- **`matched`**: Determines the type of orders to fetch.  
  - `true`: Fetch matched orders.  
  - `false`: Fetch unmatched orders.  

- **`pending`**: Filters orders based on their current status.  
  - `true`: Fetch orders that are still pending.  
  - `false`: Fetch orders that are finalized or completed.  

- **`paginationOptions`**: Configures pagination for the results.  
  - **`per_page`**: The number of transactions to fetch per page.  
  - **`page`**: The specific page number to retrieve.

## Usage

```tsx
import { OrdersProvider } from '@gardenfi/orderbook';

const ORDERBOOK_API = "https://orderbookv2.garden.finance/";
const orderbookProvider = new OrdersProvider(ORDERBOOK_API);
    
const fetchOrders = async () => {
  try {
    const res = await orderbookProvider.fetchOrders(true, false, { per_page: 10 });
    console.log("Fetched Orders:", res);
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

fetchOrders();
```
