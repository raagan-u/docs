---
id: get-order
---

# Get order  

Tracking the status of swaps is crucial for providing users with real-time updates about their transactions. The SDK provides tools to monitor and fetch details of orders efficiently.

You can fetch the transaction history and statuses directly using the `orderBook` instance.

```typescript
```typescript
getOrder(
  id: string,
  matched: T
) : AsyncResult<T extends true ? MatchedOrder : CreateOrder, string>
```
- **`id`**: The order Id.
- **`matched`**: Determines the type of orders to fetch.

  - `true`: Fetch matched orders.
  - `false`: Fetch unmatched orders.

- **`paginationOptions`**: Configures pagination for the results.
  - **`per_page`**: The number of transactions to fetch per page.
  - **`page`**: The specific page number to retrieve.

## Usage

```tsx
const orderId = <YOUR_ORDER_ID>
const orderbookApi = "https://orderbookv2.garden.finance"
const orderbook = new Orderbook(new Url(orderbookApi));

const fetchOrder = async (orderId: string) => {
  try {
    const res = await garden.orderBook.getOrder(orderId, true);
    console.log('Fetched Order:', res);
  } catch (error) {
    console.error('Error fetching order:', error);
  }
};

fetchOrder(orderId);
```
