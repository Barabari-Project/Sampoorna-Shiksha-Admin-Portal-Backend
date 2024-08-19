import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import createHttpError from 'http-errors';
import ToyModel from '../models/toyModel.js';
import mongoose from 'mongoose';

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

export const updateToy = expressAsyncHandler(async (req: Request, res: Response) => {
    const { toy } = req.body;
    const toyId = toy.id;
    if (!mongoose.Types.ObjectId.isValid(toyId)) {
        throw createHttpError(400, 'Invalid Toy ID.');
    }
    delete toy.id;
    const updatedToy = await ToyModel.findByIdAndUpdate(toyId, toy, {
        new: true, // Return the updated document
        runValidators: true, // Run schema validators on the updated fields
    });

    if (!updatedToy) {
        // If no toy is found with the provided ID, return a 404 error
        throw createHttpError(404, 'Toy not found.');
    }

    // Send the updated toy as a response
    res.status(200).json({ message: 'Toy updated successfully!', toy: updatedToy });
});