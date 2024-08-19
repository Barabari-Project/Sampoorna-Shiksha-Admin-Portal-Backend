import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import createHttpError from 'http-errors';
import ToyModel from '../models/toyModel.js';

export const addToy = expressAsyncHandler(async (req: Request, res: Response) => {
    const { toy } = req.body;

    // Check if a toy with the same srNo already exists
    const existingToy = await ToyModel.findOne({ srNo: toy.srNo });

    if (existingToy) {
        // If a toy with the same srNo exists, send an error response
        throw createHttpError(400, 'A toy with this serial number already exists.')
    }

    // Create a new toy instance and save it
    const newToy = await (new ToyModel(toy)).save();

    // Send a success response
    res.status(201).json({ message: 'Toy added successfully!', toy: newToy });
});