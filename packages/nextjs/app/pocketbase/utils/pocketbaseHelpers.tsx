import PocketBase, { RecordModel } from "pocketbase";

export const initPocketBase = (url: string): PocketBase => {
  const pb = new PocketBase(url);
  return pb;
};

export const authenticateAdmin = async (pb: PocketBase, email: string, password: string) => {
  return await pb.admins.authWithPassword(email, password);
};

export const fetchCollections = async (pb: PocketBase): Promise<string[]> => {
  const result = await pb.collections.getFullList();
  return result.map((col: any) => col.name);
};

export const fetchItems = async (pb: PocketBase, collectionName: string): Promise<RecordModel[]> => {
  return await pb.collection(collectionName).getFullList();
};

export const createItem = async (pb: PocketBase, collectionName: string, item: { [key: string]: any }) => {
  return await pb.collection(collectionName).create(item);
};

export const updateItem = async (
  pb: PocketBase,
  collectionName: string,
  itemId: string,
  item: { [key: string]: any },
) => {
  return await pb.collection(collectionName).update(itemId, item);
};

export const deleteItem = async (pb: PocketBase, collectionName: string, itemId: string) => {
  await pb.collection(collectionName).delete(itemId);
};

export const createCollection = async (pb: PocketBase, token: string, collectionData: any) => {
  await fetch(`${pb.baseUrl}/api/collections`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(collectionData),
  });
};

export const deleteCollection = async (pb: PocketBase, collectionName: string) => {
  await pb.collections.delete(collectionName);
};
