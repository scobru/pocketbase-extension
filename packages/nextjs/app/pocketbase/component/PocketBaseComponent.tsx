"use client";

import React, { useEffect, useState } from "react";
import {
  authenticateAdmin,
  createCollection,
  createItem,
  deleteCollection as deleteCollectionHelper,
  deleteItem,
  fetchCollections,
  fetchItems,
  initPocketBase,
  updateItem,
} from "../utils/pocketbaseHelpers";
import type { NextPage } from "next";
import PocketBase, { RecordModel } from "pocketbase";
import Modal from "react-modal";

const exampleSchema = JSON.stringify(
  [
    { name: "username", type: "text", required: true },
    { name: "message", type: "text", required: true },
  ],
  null,
  2,
);

const PocketBaseComponent: NextPage = () => {
  const [items, setItems] = useState<RecordModel[]>([]);
  const [pocketBaseUrl, setPocketBaseUrl] = useState("http://127.0.0.1:8090");
  const [collection, setPocketBaseCollection] = useState("");
  const [newCollection, setNewCollection] = useState("");
  const [newCollectionSchema, setNewCollectionSchema] = useState(exampleSchema);
  const [collections, setCollections] = useState<string[]>([]);
  const [fields, setFields] = useState<{ name: string; type: string }[]>([]);
  const [newItem, setNewItem] = useState<{ [key: string]: any }>({});
  const [editItem, setEditItem] = useState<{ [key: string]: any }>({});
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [pb, setPb] = useState<PocketBase | null>(null);
  const [authStatus, setAuthStatus] = useState(""); // New state for authentication status
  const [modalIsOpen, setModalIsOpen] = useState(false); // State for modal

  useEffect(() => {
    if (pocketBaseUrl) {
      const pocketBaseInstance = initPocketBase(pocketBaseUrl);
      setPb(pocketBaseInstance);
    }
  }, [pocketBaseUrl]);

  useEffect(() => {
    if (pb) {
      fetchCollections(pb).then(setCollections).catch(console.error);
    }
    if (collection && pb) {
      fetchItems(pb, collection)
        .then(records => {
          setItems(records);
          if (records.length > 0) {
            setupFieldsFromItems(records);
          } else {
            fetchCollectionSchema(pb, collection).then(setFieldsFromSchema).catch(console.error);
          }
        })
        .catch(console.error);
    }
  }, [collection, pb]);

  const setupFieldsFromItems = (records: RecordModel[]) => {
    const firstRecord = records[0];
    const fieldNames = Object.keys(firstRecord).filter(
      key => key !== "id" && key !== "collectionId" && key !== "collectionName",
    );
    setFields(fieldNames.map(name => ({ name, type: typeof firstRecord[name] })));
    setNewItem(fieldNames.reduce((acc, name) => ({ ...acc, [name]: "" }), {}));
  };

  const setFieldsFromSchema = (schema: any) => {
    const fieldNames = schema.map((field: any) => field.name);
    setFields(schema.map((field: any) => ({ name: field.name, type: field.type })));
    setNewItem(fieldNames.reduce((acc: any, name: string) => ({ ...acc, [name]: "" }), {}));
  };

  const fetchCollectionSchema = async (pb: PocketBase, collectionName: string) => {
    const collection = await pb.collections.getOne(collectionName);
    return collection.schema;
  };

  const handleCreateCollection = async () => {
    if (pb && newCollection && newCollectionSchema) {
      try {
        const authData = await authenticateAdmin(pb, adminEmail, adminPassword);
        if (authData.token) {
          const collectionData = {
            name: newCollection,
            type: "base",
            schema: JSON.parse(newCollectionSchema),
            options: {},
          };

          await createCollection(pb, authData.token, collectionData);
          setNewCollection("");
          setNewCollectionSchema(exampleSchema);
          fetchCollections(pb).then(setCollections).catch(console.error);
        }
      } catch (error) {
        console.error("Errore nella creazione della collezione:", error);
      }
    }
  };

  const handleCreateItem = async () => {
    if (pb && collection) {
      try {
        const record = await createItem(pb, collection, newItem);
        setItems([...items, record]);
        setNewItem(fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {}));
        setModalIsOpen(false); // Close modal after creating item
      } catch (error) {
        console.error("Errore nella creazione del dato:", error);
      }
    }
  };

  const handleUpdateItem = async () => {
    if (pb && collection && editItem.id) {
      try {
        const updatedRecord = await updateItem(pb, collection, editItem.id, editItem);
        setItems(items.map(item => (item.id === updatedRecord.id ? updatedRecord : item)));
        setEditItem({});
      } catch (error) {
        console.error("Error Upgrading Items:", error);
      }
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (pb && collection) {
      try {
        await deleteItem(pb, collection, id);
        setItems(items.filter(item => item.id !== id));
      } catch (error) {
        console.error("Errore nella cancellazione del dato:", error);
      }
    }
  };

  const handleDeleteCollection = async (collectionName: string) => {
    if (pb) {
      await authenticateAdmin(pb, adminEmail, adminPassword);
      try {
        await deleteCollectionHelper(pb, collectionName);
        setCollections(collections.filter(col => col !== collectionName));
        if (collection === collectionName) {
          setPocketBaseCollection("");
          setItems([]);
          setFields([]);
        }
      } catch (error) {
        console.error("Errore nella cancellazione della collezione:", error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, item: any, setItem: any) => {
    setItem({ ...item, [fieldName]: e.target.value });
  };

  const handleAdminLogin = async () => {
    if (pb && adminEmail && adminPassword) {
      try {
        const authData = await authenticateAdmin(pb, adminEmail, adminPassword);
        if (authData.token) {
          setAuthStatus("Login successful");
        } else {
          setAuthStatus("Login failed");
        }
      } catch (error) {
        setAuthStatus("Login failed");
        console.error("Error authenticating admin:", error);
      }
    }
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pocket Base Extension</h1>
      <div className="mb-4">
        <label className="block mb-2">
          PocketBase URL:
          <input
            type="text"
            value={pocketBaseUrl}
            onChange={e => setPocketBaseUrl(e.target.value)}
            placeholder="http://127.0.0.1:8090"
            className="input input-bordered w-full my-2"
          />
        </label>
      </div>
      <div className="mb-8 mt-8">
        <h2 className="text-xl mb-2">Admin Authentication</h2>
        <label className="block mb-2">
          Admin Email:
          <input
            type="email"
            value={adminEmail}
            onChange={e => setAdminEmail(e.target.value)}
            placeholder="admin@example.com"
            className="input input-bordered w-full my-2"
          />
        </label>
        <label className="block mb-2">
          Admin Password:
          <input
            type="password"
            value={adminPassword}
            onChange={e => setAdminPassword(e.target.value)}
            placeholder="password"
            className="input input-bordered w-full my-2"
          />
        </label>
        <button onClick={handleAdminLogin} className="btn btn-primary mb-4">
          Login
        </button>
        {authStatus && <p>{authStatus}</p>}
      </div>
      <div className="mb-8 mt-8">
        <label className="block mb-2">
          Collection Name:
          <input
            type="text"
            value={collection}
            onChange={e => setPocketBaseCollection(e.target.value)}
            placeholder="nome_collezione"
            className="input input-bordered w-full my-2"
          />
        </label>
        <button
          onClick={() => fetchItems(pb!, collection).then(setItems).catch(console.error)}
          className="btn btn-primary mb-4"
        >
          Fetch Items
        </button>
      </div>
      {items.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  {fields.map(field => (
                    <th key={field.name}>{field.name}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    {fields.map(field => (
                      <td key={field.name}>
                        {editItem.id === item.id ? (
                          <input
                            type={field.type === "number" ? "number" : field.type === "password" ? "password" : "text"}
                            value={editItem[field.name]}
                            onChange={e => handleInputChange(e, field.name, editItem, setEditItem)}
                            className="input input-bordered w-full my-2"
                          />
                        ) : (
                          item[field.name]
                        )}
                      </td>
                    ))}
                    <td>
                      {editItem.id === item.id ? (
                        <button onClick={handleUpdateItem} className="btn btn-success btn-sm">
                          Save
                        </button>
                      ) : (
                        <button onClick={() => setEditItem(item)} className="btn btn-warning btn-sm">
                          Edit
                        </button>
                      )}
                      <button onClick={() => handleDeleteItem(item.id)} className="btn btn-error btn-sm ml-2">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <div className="mb-8 mt-8">
        <button onClick={openModal} className="btn btn-secondary mb-4">
          Create New Item
        </button>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Create New Item Modal"
          className="bg-base"
        >
          <h2 className="text-xl mb-2">Create New Item</h2>
          {fields.map(field => (
            <label key={field.name} className="block mb-2">
              {field.name.charAt(0).toUpperCase() + field.name.slice(1)}:
              <input
                type={field.type === "number" ? "number" : field.type === "password" ? "password" : "text"}
                value={newItem[field.name]}
                onChange={e => handleInputChange(e, field.name, newItem, setNewItem)}
                className="input input-bordered w-full my-2"
              />
            </label>
          ))}
          <button onClick={handleCreateItem} className="btn btn-secondary mb-4">
            Create Item
          </button>
          <button onClick={closeModal} className="btn btn-error mb-4">
            Cancel
          </button>
        </Modal>
      </div>
      <div className="mb-8 mt-8">
        <h2 className="text-xl mb-2">Create New Collection</h2>
        <label className="block mb-2">
          New Collection Name:
          <input
            type="text"
            value={newCollection}
            onChange={e => setNewCollection(e.target.value)}
            placeholder="nome_nuova_collezione"
            className="input input-bordered w-full my-2"
          />
        </label>
        <label className="block mb-2 mt-2">
          Collection Schema (JSON):
          <textarea
            value={newCollectionSchema}
            onChange={e => setNewCollectionSchema(e.target.value)}
            placeholder={exampleSchema}
            className="textarea textarea-bordered w-full rounded-none"
            rows={6}
          />
        </label>
        <button onClick={handleCreateCollection} className="btn btn-secondary mb-4">
          Create Collection
        </button>
      </div>
      <div className="mb-4">
        <h2 className="text-xl mb-2">Existing Collections</h2>
        <ul>
          {collections.map(col => (
            <li key={col} className="flex justify-between items-center my-2">
              <span>{col}</span>
              <button onClick={() => handleDeleteCollection(col)} className="btn btn-error btn-sm">
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PocketBaseComponent;
