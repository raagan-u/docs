---
id: sdk-demo-app
---

# SDK Demo App using Nextjs

This guide showcases integrating Garden sdk into a Nextjs app.

## Ui overview

![start UI](../images/sdk-demo-app/sdk-demo-app-ui.png)

## Garden Provider

Garden provider is the parent wrapper that provides all the necessary context and methods related to quote, orderbook etc.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="provider" label="GardenProvider.tsx">
    ```typescript
    import { GardenProvider } from '@garden/sdk';

    export default function App() {
      return (
        <GardenProvider>
          {/* Your app content */}
        </GardenProvider>
      );
    }
    ```

  </TabItem>
  <TabItem value="hooks" label="useGarden.ts">
    ```typescript
    import { useGarden } from '@garden/sdk';

    export function YourComponent() {
      const { quote, orderbook } = useGarden();
      // Use the garden context
    }
    ```

  </TabItem>
</Tabs>
