# Architecture Overview

```mermaid
flowchart LR
    subgraph API
        OC[OrderController]
    end
    subgraph Service
        OS[OrderService]
    end
    subgraph Data
        OR[(OrderRepository)]
    end
    OC -->|customerId, items| OS
    OS -->|save / findById| OR
```

## Components

- **OrderController** — REST entry point. Exposes create and lookup operations.
- **OrderService** — validates orders and delegates persistence.
- **OrderRepository** — persistence boundary for orders.
