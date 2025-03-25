---
id: settle-order
---

# Settle order

Redeeming and refunding ensure the completion of swaps or the recovery of funds, depending on the swap's state.  

After creating an order (or multiple orders), you can settle them on the destination chain using the `execute` method from the Garden instance. This method automatically polls the order book for orders pending settlement on the destination chain and submits them on-chain—without requiring users to pay gas fees.  

```typescript
await garden.execute();
```

## Subscribe to Garden events

It is crucial to keep the Garden instance running until the Bitcoin transaction is mined and visible at the provided URL. This ensures that Garden can automatically resubmit the redeem transaction if necessary, addressing issues such as dropped transactions or network disruptions. If the instance is stopped, restarting it will prompt Garden to check the order status and resubmit the redeem if required, ensuring seamless transaction completion.

```typescript
garden.on('error', (order, error) => {
  console.error(
    `Error occurred for order ID: ${order.create_order.create_id}, Details:`,
    error
  );
});

garden.on('success', (order, action, txHash) => {
  console.log(`${order} ${action} ${txHash}`);
});
```

For a detailed understanding of the various statuses and how they progress, refer to the [**Order lifecycle**](../../core/OrderLifecycle.md) documentation.

Refer to the [Cookbook](../cookbook/Cookbook.md) or reach out to us.  
