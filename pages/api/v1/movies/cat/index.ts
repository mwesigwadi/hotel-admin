import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/db'; // Adjust the import path based on your project structure
import { ObjectId } from 'mongodb';

interface Category {
    _id?: ObjectId;
    name: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const db = await connectToDatabase();
        const categoriesCollection = db.collection<Category>('categories');

        // Retrieve common categories
        const categories = await categoriesCollection.find({}).
            project({ name: 1, _id: 0 }).toArray();

        if (categories.length > 0) {
            res.status(200).json(categories);
        } else {
            res.status(404).json({ message: 'No categories found' });
        }
    } catch (error) {
        console.error('Error retrieving categories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
