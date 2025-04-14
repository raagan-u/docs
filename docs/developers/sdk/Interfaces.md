---
id: interfaces
title: Interfaces
---

# Interfaces

## IGardenJS

```ts
interface IGardenJS {
  get orderbookUrl(): string;
  get evmHTLC(): IEVMHTLC | undefined;
  get starknetHTLC(): IStarknetHTLC | undefined;
  get quote(): IQuote;
  get btcWallet(): IBitcoinWallet | undefined;
  get orderbook(): IOrderbook;
  get blockNumberFetcher(): IBlockNumberFetcher;
  get secretManager(): ISecretManager;
  get auth(): IAuth;
  get digestKey(): DigestKey;
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
    order: CreateOrderRequestWithAdditionalData,
    auth: IAuth,
  ): AsyncResult<string, string>;
  getOrder<T extends boolean>(
    id: string,
    matched: T,
  ): AsyncResult<T extends true ? MatchedOrder : CreateOrder, string>;
  getMatchedOrders(
    address: string,
    pending: boolean,
    paginationConfig?: PaginationConfig,
  ): AsyncResult<PaginatedData<MatchedOrder>, string>;
  getUnMatchedOrders(
    address: string,
    paginationConfig?: PaginationConfig,
  ): AsyncResult<PaginatedData<CreateOrder>, string>;
  getOrders<T extends boolean>(
    matched: T,
    paginationConfig?: PaginationConfig,
  ): AsyncResult<
    PaginatedData<T extends true ? MatchedOrder : CreateOrder>,
    string
  >;
  subscribeOrders<T extends boolean>(
    account: string,
    matched: T,
    interval: number,
    cb: (
      orders: PaginatedData<T extends true ? MatchedOrder : CreateOrder>,
    ) => Promise<void>,
    pending?: boolean,
    paginationConfig?: PaginationConfig,
  ): Promise<() => void>;
  getOrdersCount(address: string): AsyncResult<number, string>;
}
```

## ISecretManager

```ts
interface ISecretManager extends EventBroker<SecretManagerEvents> {
  readonly isInitialized: boolean;
  initialize: () => AsyncResult<string, string>;
  getDigestKey: () => AsyncResult<string, string>;
  generateSecret: (nonce: number) => AsyncResult<Secret, string>;
}
```

## IBlockNumberFetcher

```ts
interface IblockNumberFetcher {
  fetchBlockNumbers(): AsyncResult<Response, string>;
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

## IEVMHTLC

```ts
interface IEVMHTLC {
  /**
   * Returns the HTLC actor address.
   * This is the user's wallet address in the case of EVM.
   */
  get htlcActorAddress(): string;

  /**
   * Initiates the HTLC by sending funds to the HTLC contract.
   * @param order - The matched order.
   * @returns A promise resolving to the transaction hash of the initiation.
   */
  initiate(order: MatchedOrder): AsyncResult<string, string>;

  /**
   * Redeems funds from the HTLC contract to the actor's address.
   * @param order - The matched order.
   * @param secret - The secret required to unlock the htlc.
   * @returns A promise resolving to the transaction hash of the redemption.
   */
  redeem(order: MatchedOrder, secret: string): AsyncResult<string, string>;

  /**
   * Refunds funds from the HTLC contract back to the actor's address upon expiration.
   * @param order - The matched order.
   * @returns A promise resolving to the transaction hash of the refund.
   */
  refund(order: MatchedOrder): AsyncResult<string, string>;
}
```

## IStarknetHTLC

```ts
interface IStarknetHTLC {
  /**
   * The address of the HTLC actor.
   */
  get htlcActorAddress(): string;
  /**
   * Initiates the HTLC by sending funds to the HTLC contract.
   * @param order - The matched order.
   * @returns A promise resolving to the transaction hash of the initiation.
   */
  initiate(order: MatchedOrder): AsyncResult<string, string>;

  /**
   * Redeems funds from the HTLC contract to the actor's address.
   * @param order - The matched order.
   * @param secret - The secret required to unlock the htlc.
   * @returns A promise resolving to the transaction hash of the redemption.
   */
  redeem(order: MatchedOrder, secret: string): AsyncResult<string, string>;

  /**
   * Refunds funds from the HTLC contract back to the actor's address upon expiration.
   * @param order - The matched order.
   * @returns A promise resolving to the transaction hash of the refund.
   */
  refund(order: MatchedOrder): AsyncResult<string, string>;
}
```
