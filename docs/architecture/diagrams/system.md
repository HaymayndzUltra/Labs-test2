```mermaid
flowchart LR
  subgraph FE[Frontend]
    UI[UI Components]
  end
  subgraph API[Backend API]
    GW[HTTP API /v1]
  end
  subgraph Store[Data Store]
    DB[(Relational DB)]
  end

  UI -- JSON over HTTPS --> GW
  GW -- CRUD + Queries --> DB

  note over UI,GW: Contracts in contracts/api/*. OpenAPI-driven. Mocks in contracts/mocks/*.
```

