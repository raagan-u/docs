---
id: get-order
---

# Get order  

Tracking the status of swaps is crucial for providing users with real-time updates about their transactions. The SDK provides tools to monitor and fetch details of orders efficiently.

You can fetch the transaction history and statuses directly using the `orderBook` instance.

```typescript
getOrders(
  matched: T,
  paginationOptions?: {
    page?: number;
    per_page?: number;
  }
) => {
  data: T[];
  page: number;
  total_pages: number;
  total_items: number;
  per_page: number;
}
```

- **`matched`**: Determines the type of orders to fetch.  
  - `true`: Fetch matched orders.  
  - `false`: Fetch unmatched orders.  

- **`paginationOptions`**: Configures pagination for the results.  
  - **`per_page`**: The number of transactions to fetch per page.  
  - **`page`**: The specific page number to retrieve.

## Usage

```tsx
import { useGarden } from '@gardenfi/react-hooks';

const { orderBook } = useGarden();

const fetchOrders = async () => {
  try {
    const res = await orderBook.getOrders(true, { per_page: 10 });
    console.log("Fetched Orders:", res);
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

fetchOrders();
```
