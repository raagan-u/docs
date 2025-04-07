---
id: pagination
title: Pagination
---

# Pagination

## PaginationConfig

This type represents the configuration for paginating data in API requests.

| Property   | Type     | Optional | Description                                                                                 |
| ---------- | -------- | -------- | ------------------------------------------------------------------------------------------- |
| `page`     | `number` | Yes      | The current page of results to fetch. Defaults to the first page if not specified.          |
| `per_page` | `number` | Yes      | The number of results to include per page. Defaults to a predefined value if not specified. |

## `PaginatedData<T>`

This type represents a generic structure for paginated responses from an API.

| Property      | Type     | Description                                                    |
| ------------- | -------- | -------------------------------------------------------------- |
| `data`        | `T[]`    | An array of items of type `T` representing the paginated data. |
| `page`        | `number` | The current page number being returned.                        |
| `total_pages` | `number` | The total number of pages available.                           |
| `total_items` | `number` | The total number of items available across all pages.          |
| `per_page`    | `number` | The number of items included per page.                         |

**Example Usage:**

```typescript
type ExampleData = {
  id: string;
  name: string;
};

const paginatedResponse: PaginatedData<ExampleData> = {
  data: [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
  ],
  page: 1,
  total_pages: 5,
  total_items: 50,
  per_page: 10,
};
```
