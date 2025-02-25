---
id: interfaces
title: Interfaces
---

# Interfaces

## IGardenJS

```ts
interface IGardenJS {
  get orderbookUrl(): string;
  get evmRelay(): IEVMRelay;
  get quote(): IQuote;
  get btcWallet(): IBitcoinWallet | undefined;
  get orderbook(): IOrderbook;
  get blockNumberFetcher(): IBlockNumberFetcher;
  get secretManager(): ISecretManager;
  swap(params: SwapParams): AsyncResult<MatchedOrder, string>;
  execute(): Promise<() => void>;
}
```

## IQuote

```ts
interface IQuote {
  getQuote(
    orderpair: string,
    amount: number,
    isExactOut: boolean
  ): AsyncResult<QuoteResponse, string>;
  getAttestedQuote(
    order: CreateOrderReqWithStrategyId
  ): AsyncResult<CreateOrderRequestWithAdditionalData, string>;
  getStrategies(): AsyncResult<Strategies, string>;
}
```

## IOrdersProvider

```ts
interface IOrderProvider {
  getOrder<T extends boolean>(
    id: string,
    matched: T
  ): AsyncResult<T extends true ? MatchedOrder : CreateOrder, string>;
  getMatchedOrders(
    address: string,
    pending: boolean,
    paginationConfig?: PaginationConfig
  ): AsyncResult<PaginatedData<MatchedOrder>, string>;
  getUnMatchedOrders(
    address: string,
    paginationConfig?: PaginationConfig
  ): AsyncResult<PaginatedData<CreateOrder>, string>;
  getOrders<T extends boolean>(
    matched: T,
    paginationConfig?: PaginationConfig
  ): AsyncResult<
    PaginatedData<T extends true ? MatchedOrder : CreateOrder>,
    string
  >;
  subscribeOrders<T extends boolean>(
    account: string,
    matched: T,
    interval: number,
    cb: (
      orders: PaginatedData<T extends true ? MatchedOrder : CreateOrder>
    ) => Promise<void>,
    pending?: boolean,
    paginationConfig?: PaginationConfig
  ): Promise<() => void>;
  getOrdersCount(address: string): AsyncResult<number, string>;
}
```

## IOrderbook

```ts
interface IOrderbook extends IOrderProvider {
  createOrder(
    order: CreateOrderRequestWithAdditionalData
  ): AsyncResult<string, string>;
  fetchOrders<T extends boolean>(
    matched: T,
    pending?: boolean,
    paginationConfig?: PaginationConfig
  ): AsyncResult<
    PaginatedData<T extends true ? MatchedOrder : CreateOrder>,
    string
  >;
  subscribeToOrders(
    interval: number,
    cb: (orders: PaginatedData<MatchedOrder>) => Promise<void>,
    paginationConfig?: PaginationConfig,
    pending?: boolean
  ): Promise<() => void>;
  getUserOrdersCount(): AsyncResult<number, string>;
}
```

## ISecretManager

```ts
interface ISecretManager extends EventBroker<SecretManagerEvents> {
  readonly isInitialized: boolean;
  initialize: () => AsyncResult<string, string>;
  getMasterPrivKey: () => AsyncResult<string, string>;
  generateSecret: (nonce: number) => AsyncResult<Secret, string>;
}
```

## IHTLCWallet

```ts
interface IHTLCWallet {
  id(): string;
  init(): Promise<string>;
  redeem(secret: string, receiver?: string): Promise<string>;
  refund(receiver?: string): Promise<string>;
}
```
