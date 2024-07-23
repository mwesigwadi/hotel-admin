import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/db';
import { ObjectId } from 'mongodb';

interface TV {
    _id?: ObjectId;
    tvBrand: string;
    serialNumber: string;
    floorNumber: string;
    roomNumber: string;
    activity: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const db = await connectToDatabase();
        const tvCollection = db.collection<TV>('tvs');

        // Retrieve only the necessary fields
        const tvs = await tvCollection.find({}, {
            projection: {
                tvBrand: 1,
                serialNumber: 1,
                floorNumber: 1,
                roomNumber: 1,
                activity: 1,
                _id: 0 // Exclude the _id field
            }
        }).toArray();

        if (tvs.length > 0) {
            res.status(200).json(tvs);
        } else {
            res.status(404).json({ message: 'No TVs found' });
        }
    } catch (error) {
        console.error('Error retrieving TVs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
