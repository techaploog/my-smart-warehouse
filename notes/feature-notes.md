# Feature Notes

Capture product decisions, planning notes, and feature ideas that should stay visible during implementation.

## Immediate Priorities

### 1. Inventory Document Workflow and Stock Movement Ledger
- Goal: Add document-based inventory workflows for receiving, issue, transfer, return, adjustment, and count correction.
- Workflow: Each document should support relevant states such as draft, submitted, approved, in transit, received, completed, and canceled.
- Tracking: Store who created, approved, and received each document, along with timestamps and reference details.
- Ledger rule: Each completed document action should write immutable entries to `stock_movements` so stock history remains auditable.
- Why it matters: Documents handle the operational process, while the ledger provides the source of truth for stock movement history.
- Note: This should be treated as the core warehouse feature because many other workflows depend on it.

### 2. Warehouse Dashboard
- Goal: Show total SKUs, stock records, low-stock count, inactive items, stores, recent updates, and quick links.
- Note: This should be the first real frontend screen.

### 3. Low-Stock and Reorder Alerts
- Goal: Add backend endpoints and UI views for `needs reorder`, `below safety stock`, and `over max stock`.
- Note: Existing stock fields such as `minQty`, `reorderPoint`, and `safetyStock` should support this feature.

### 4. Store-Scoped Permissions
- Goal: Add store-aware authorization so users can only view and update stock for their assigned stores.
- Why it matters: Current permission checks appear to be resource/action based and do not enforce store scope.

## Operational Workflows

### 5. Receiving / Goods-In
- Goal: Add purchase receiving or manual inbound receipts.
- Note: Even without a full purchase-order module, a receiving screen with supplier, item, quantity, store, document reference, and movement history would be valuable.

### 6. Cycle Count / Stock Take
- Goal: Add count sessions per store that freeze expected quantity, capture counted quantity, calculate variance, approve adjustments, and write stock movements.
- Why it matters: This is a practical requirement for real warehouse operations.

## Data Management and Usability

### 7. Item Master UI
- Goal: Build screens for SKU listing, filtering, create/edit flows, active toggle, categories, brands, units, suppliers, images, and documents.
- Note: The backend already appears to expose most of the needed endpoints.

### 8. Search and Filtering
- Goal: Add search by SKU, name, category, brand, supplier, store, and status, along with sort support.
- Why it matters: Pagination-only lists will become limiting as soon as the UI starts handling real data.

### 9. Audit Trail and Activity History
- Goal: Track who created, updated, deleted, or toggled records, and who changed stock quantities.
- Note: This pairs especially well with the stock movement ledger and store-scoped permissions.
