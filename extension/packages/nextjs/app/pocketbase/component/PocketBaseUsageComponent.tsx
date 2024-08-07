"use client";

import React from "react";

const PocketBaseUsageComponent: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">How to Use PocketBase Extension</h1>

      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Import and Initialize PocketBase</h2>
        <p>Import PocketBase and initialize it with your server URL:</p>
        <div className="mockup-code">
          <pre data-prefix="1">
            <code>
              import PocketBase from {`&apos;`} pocketbase {`&lsquo;`};
            </code>
          </pre>
          <pre data-prefix="2">
            <code>{`const pb = initPocketBase("http://127.0.0.1:8090");`}</code>
          </pre>
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Authenticate Admin</h2>
        <p>Authenticate admin to perform administrative tasks:</p>
        <div className="mockup-code">
          <pre data-prefix="1">
            <code>{`import { autenticateAdmin } from "../utils/pocketbaseHelpers"`}</code>
          </pre>
          <pre data-prefix="2">
            <code>{`const authData = await authenticateAdmin(pb, adminEmail, adminPassword);`}</code>
          </pre>
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Create a Collection</h2>
        <p>Use the following function to create a new collection:</p>
        <div className="mockup-code">
          <pre data-prefix="1">
            <code>{`const collectionData = {`}</code>
          </pre>
          <pre data-prefix="2">
            <code>{`  name: 'your_collection_name' `}</code>
          </pre>
          <pre data-prefix="3">
            <code>{`  type: "base",`}</code>
          </pre>
          <pre data-prefix="4">
            <code>{`  schema: JSON.parse(newCollectionSchema),`}</code>
          </pre>
          <pre data-prefix="5">
            <code>{`  options: {},`}</code>
          </pre>
          <pre data-prefix="6">
            <code>{`};`}</code>
          </pre>
          <pre data-prefix="7">
            <code>{`import { createCollection } from '../utils/pocketbaseHelpers'`}</code>
          </pre>
          <pre data-prefix="8">
            <code>{`await createCollection(pb, authData.token, collectionData);`}</code>
          </pre>
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Fetch Collections and Items</h2>
        <p>Fetch collections and items from PocketBase:</p>
        <div className="mockup-code">
          <pre data-prefix="0">
            <code>{`import { fetchCollections } from "../utils/pocketbaseHelpers"`}</code>
          </pre>
          <pre data-prefix="1">
            <code>{`const collections = await fetchCollections(pb);`}</code>
          </pre>
          <pre data-prefix="2">
            <code>{`import { fetchItems } from "../utils/pocketbaseHelpers"`}</code>
          </pre>
          <pre data-prefix="3">
            <code>{`const items = await fetchItems(pb, "your_collection_name");`}</code>
          </pre>
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Manage Items</h2>
        <p>Create, update, and delete items in a collection:</p>
        <div className="mockup-code">
          <pre data-prefix="0">
            <code>{`import { createItem, updateItem, deleteItem } from "../utils/pocketbaseHelpers"`}</code>
          </pre>
          <pre data-prefix="1">
            <code>{`const newItem = await createItem(pb, "your_collection_name", itemData);`}</code>
          </pre>
          <pre data-prefix="2">
            <code>{`const updatedItem = await updateItem(pb, "your_collection_name", itemId, itemData);`}</code>
          </pre>
          <pre data-prefix="3">
            <code>{`await deleteItem(pb, "your_collection_name", itemId);`}</code>
          </pre>
        </div>
      </div>
      <div className="mt-4">
        <p>
          For more detailed examples and functions, refer to the provided helper functions in the{" "}
          <code>pocketbaseHelpers</code> module.
        </p>
      </div>
    </div>
  );
};

export default PocketBaseUsageComponent;
