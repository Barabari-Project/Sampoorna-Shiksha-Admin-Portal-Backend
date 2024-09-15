import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import StockModel from '../models/stockModel.js';
import createHttpError from 'http-errors';
import { checkMogooseId } from '../utils/validation.js';
import ToyModel from '../models/toyModel.js';

export const addNewStock = expressAsyncHandler(async (req: Request, res: Response) => {
    const { toys } = req.body; // Expecting an array of { toy: ObjectId, quantity: number }

    for (const item of toys) {
        const { toy, quantity } = item;
        checkMogooseId(toy, 'toy');
        const parsedQuantity = Number(quantity);
        if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
            throw createHttpError(400, 'Quantity must be a valid non-negative integer.');
        }
        const isToyExists = ToyModel.exists({ _id: toy });
        if (!isToyExists) {
            throw createHttpError(400, 'Toy is not exists with given id.');
        }
    }

    try {

        const updateList = toys.map((item) => {
            const { toy, quantity } = item;
            return StockModel.findOneAndUpdate(
                { toy: toy }, // Search condition
                { $inc: { quantity } }, // Increment quantity
                {
                    new: true, // Return the updated document
                    upsert: true // Create the document if it doesn't exist
                }
            );
        });

        await Promise.all(updateList);
        res.status(200).json({ message: 'Stock successfully updated.' });
    } catch (error) {
        console.error(error.message);
        throw createHttpError(400, 'Failed to add toys in stock', error.message);
    }
});

export const removeFromStock = expressAsyncHandler(async (req: Request, res: Response) => {
    const { toys } = req.body; // Expecting an array of { toy: ObjectId, quantity: number }

    for (const item of toys) {
        const { toy, quantity } = item;
        checkMogooseId(toy, 'toy');
        const parsedQuantity = Number(quantity);
        if (!Number.isInteger(parsedQuantity) || parsedQuantity < 0) {
            throw createHttpError(400, 'Quantity must be a valid non-negative integer.');
        }
        const isToyExists = ToyModel.exists({ _id: toy });
        if (!isToyExists) {
            throw createHttpError(400, 'Toy is not exists with given id.');
        }
    }
    const session = await StockModel.startSession();
    session.startTransaction();

    try {

        for (const item of toys) {
            const { toy, quantity } = item;

            // Find the stock entry for the given toy
            const existingStock = await StockModel.findOne({ toy }).session(session);

            if (!existingStock) {
                throw new Error(`Stock entry for toy ${toy} does not exist.`);
            }

            if (existingStock.quantity < quantity) {
                throw new Error(`Not enough stock for toy ${toy}. Available quantity: ${existingStock.quantity}`);
            }

            // Update the quantity
            existingStock.quantity -= quantity;
            await existingStock.save({ session });
        }

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ message: 'Stock quantities successfully reduced.' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error.message);
        throw createHttpError(400, 'Failed to remove stock quantities', error.message);
    }
});

export const getStock = expressAsyncHandler(async (req: Request, res: Response) => {
    const stock = await StockModel.find().populate('toy');
    res.status(200).json({ toys: stock });
});

export const deleteToyFromStock = expressAsyncHandler(async (req: Request, res: Response) => {
    const { toy } = req.params;

    checkMogooseId(toy, 'toy');
    const deletedStockItem = await StockModel.findOneAndDelete({ toy });

    if (!deletedStockItem) {
        throw createHttpError(404, 'Toy not found in stock');
    }

    res.status(200).json({ message: 'Toy deleted successfully from stock.' });
});