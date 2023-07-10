import { MongoClient } from "mongodb";

export async function connectDatabase() {
  const client = await MongoClient.connect(
    "mongodb+srv://baget:gMLEH5ae0Gesaz4L@cluster0.tkuohn6.mongodb.net/events?retryWrites=true&w=majority"
  );

  return client;
}

export async function insertDocument(client, collection, document) {
  const db = client.db();
  return await db.collection(collection).insertOne(document);
}

export async function getAllDocuments(client, collection, sort, filter = {}) {
  const db = client.db();

  return await db.collection(collection).find(filter).sort(sort).toArray();
}
