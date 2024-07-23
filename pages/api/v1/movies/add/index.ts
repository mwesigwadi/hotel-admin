import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from 'mongodb';

interface Movie {
    _id?: ObjectId;
    name: string;
    duration: string;
    price: string;
    category: string;
    part: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { name, duration, price, category, part } = req.body;

    if (!name || !duration || !price || !category || !part) {
        return res.status(400).json({ error: 'All fields must be provided' });
    }

    try {
        const db = await connectToDatabase();
        const moviesCollection = db.collection<Movie>("movies");

        const existingMovie = await moviesCollection.findOne({ name, category, part });
        if (existingMovie) {
            return res.status(400).json({ error: `Movie '${name}' in category '${category}' part '${part}' already exists` });
        }

        const newMovie: Movie = {
            name,
            duration,
            price,
            category,
            part,
        };

        const result = await moviesCollection.insertOne(newMovie);

        if (result.acknowledged) {
            res.status(200).json({ message: 'Movie successfully added', movieId: result.insertedId });
        } else {
            res.status(400).json({ error: 'Failed to add movie' });
        }

    } catch (error) {
        console.error("Error adding movie:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
