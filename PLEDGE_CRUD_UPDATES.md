# Admin Pledge Page CRUD Updates

I have successfully added full Create, Read, Update, and Delete (CRUD) operations to the Admin Pledge Page.

## 1. Backend Updates
- **Controller**: `server/controllers/admin/adminPledge.controller.js`
  - Added `createPledgeAdmin`: Allows creating a new pledge.
  - Added `updatePledgeAdmin`: Allows updating an existing pledge by ID.
- **Routes**: `server/routes/admin/adminPledge.routes.js`
  - `POST /api/admin/pledges`: Endpoint for creating pledges.
  - `PUT /api/admin/pledges/:id`: Endpoint for updating pledges.

## 2. Frontend Updates
- **API Service**: `client/src/services/adminApi.js`
  - Added `create` and `update` methods to `adminPledgeAPI`.
- **UI Component**: `client/src/pages/admin/PledgeAdmin.jsx`
  - **Add Button**: Added an "Add New" button to the page header.
  - **Edit Button**: Added an edit icon button to each row in the pledges table.
  - **Modal**: Implemented a modal popup form that handles both creating new pledges and editing existing ones.
  - **Form Handling**: Added state management for form data and logic to switch between "Create" and "Edit" modes.

## How to Use
1.  **Add Pledge**: Click the "Add New" button, fill in the details, and click "Save Pledge".
2.  **Edit Pledge**: Click the pencil icon next to a pledge row, modify the details in the modal, and click "Save Pledge".
3.  **Delete Pledge**: Used the existing trash icon to remove a pledge (functionality preserved).
