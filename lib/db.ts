import { MongoClient, Db } from 'mongodb';

const connectionString= "mongodb://serena:serena@localhost:28028/?authSource=serena_iptv";
const dbName = 'serena_iptv';
const mClient: MongoClient = new MongoClient(connectionString);

export async function connectToDatabase() {
    const database:MongoClient = await  mClient.connect();
    return database.db(dbName);
}

export  async function closeClient() {
    await mClient.close();
}

