import {NextApiRequest, NextApiResponse} from "next";
import {closeClient, connectToDatabase} from "@/lib/db";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const db = await connectToDatabase();
        const collection = db.collection('channels');

        // Fetch items from the collection
        const items = await collection.find({}).toArray();

        res.status(200).json(items);
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        await closeClient();
    }
}
