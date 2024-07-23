import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

interface TV {
    _id?: ObjectId;
    tvBrand: string;
    serialNumber: string;
    floorNumber: string;
    roomNumber: string;
    status: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { tvBrand, serialNumber, floorNumber, roomNumber } = req.body;

    // Validate the incoming data
    if (!tvBrand || !serialNumber || !floorNumber || !roomNumber) {
        return res.status(400).json({ error: 'All fields must be provided' });
    }

    try {
        const db = await connectToDatabase();
        const tvCollection = db.collection<TV>('tvs');

        const newTV: TV = {
            tvBrand,
            serialNumber,
            floorNumber,
            roomNumber,
            status: false,
        };

        const result = await tvCollection.insertOne(newTV);

        if (result.acknowledged) {
            res.status(200).json({ message: 'TV successfully added', tvId: result.insertedId });
        } else {
            res.status(400).json({ error: 'Failed to add TV' });
        }
    } catch (error) {
        console.error('Error adding TV:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
