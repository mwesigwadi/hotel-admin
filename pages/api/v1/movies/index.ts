import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/db";

interface Movie {
    name: string;
    duration: string;
    price: string;
    category: string;
    part: string;
}
//add movies to be retrieved in categories
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: "Method not allowed" });
    }
    const { category }=req.body;

    try {
        const db = await connectToDatabase();
        const moviesCollection = db.collection<Movie>("movies");

        // Retrieve only the name, category, and duration fields without the _id field
        const movies = await moviesCollection.find({},
            { projection:
                    { name: 1,
                    category: 1,
                    duration: 1,
                    _id: 0 }
            }).toArray();

        if (movies.length > 0) {
            res.status(200).json(movies);
        } else {
            res.status(404).json({ message: "No movies found" });
        }
    } catch (error) {
        console.error("Error retrieving movies:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
