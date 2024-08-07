Certainly. To make the markdown file downloadable, I'll provide you with the raw markdown content. You can copy this content and save it as a `.md` file on your local machine. Here's how you can do it:

1. Copy the entire markdown content below.
2. Open a text editor on your computer (like Notepad, TextEdit, or any code editor).
3. Paste the copied content into the text editor.
4. Save the file with a `.md` extension, for example `README.md`.

Here's the raw markdown content:

```markdown
# PocketBase Utility Functions

This module provides utility functions for interacting with PocketBase, a backend for your next SaaS and Mobile app. It includes functions for authentication, fetching data, and managing collections and items.

## Installation

To use these functions, you need to install PocketBase:

```bash
npm install pocketbase
```

## Usage

Import the functions you need:

```typescript
import {
  initPocketBase,
  authenticateAdmin,
  fetchCollections,
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
  createCollection,
  deleteCollection
} from './utils/pocketbaseHelpers';
```

## Functions

### `initPocketBase(url: string): PocketBase`

Initializes a new PocketBase instance.

```typescript
const pb = initPocketBase('https://your-pocketbase-url.com');
```

### `authenticateAdmin(pb: PocketBase, email: string, password: string): Promise<AdminAuthResponse>`

Authenticates an admin user.

```typescript
const authData = await authenticateAdmin(pb, 'admin@example.com', 'password');
```

### `fetchCollections(pb: PocketBase): Promise<string[]>`

Fetches all collection names.

```typescript
const collections = await fetchCollections(pb);
```

### `fetchItems(pb: PocketBase, collectionName: string): Promise<RecordModel[]>`

Fetches all items from a specific collection.

```typescript
const items = await fetchItems(pb, 'my_collection');
```

### `createItem(pb: PocketBase, collectionName: string, item: { [key: string]: any }): Promise<RecordModel>`

Creates a new item in a collection.

```typescript
const newItem = await createItem(pb, 'my_collection', { name: 'New Item', description: 'Description' });
```

### `updateItem(pb: PocketBase, collectionName: string, itemId: string, item: { [key: string]: any }): Promise<RecordModel>`

Updates an existing item in a collection.

```typescript
const updatedItem = await updateItem(pb, 'my_collection', 'item_id', { name: 'Updated Item' });
```

### `deleteItem(pb: PocketBase, collectionName: string, itemId: string): Promise<void>`

Deletes an item from a collection.

```typescript
await deleteItem(pb, 'my_collection', 'item_id');
```

### `createCollection(pb: PocketBase, token: string, collectionData: any): Promise<void>`

Creates a new collection.

```typescript
await createCollection(pb, 'admin_token', { name: 'new_collection', schema: [...] });
```

### `deleteCollection(pb: PocketBase, collectionName: string): Promise<void>`

Deletes a collection.

```typescript
await deleteCollection(pb, 'collection_to_delete');
```