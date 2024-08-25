import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import VendorOrderModel from '../models/vendorOrderModel.js';
import createHttpError from 'http-errors';
import { IVendorOrder, VendorCartItem, VendorOrderStatus, VendorOrderType } from '../utils/types.js';
import { checkMogooseId } from '../utils/validation.js';

export const placeOrder = expressAsyncHandler(async (req: Request, res: Response) => {
    const { cart, orderType, address }: { cart: VendorCartItem[], orderType: VendorOrderType, address: string } = req.body;

    cart.forEach((toy) => {
        checkMogooseId(toy.toyId, 'toy');
        const parsedQuantity = Number(toy.quantity);
        if (!Number.isInteger(parsedQuantity) || parsedQuantity < 0) {
            throw createHttpError(400, 'Quantity must be a valid non-negative integer.');
        }
    });

    const orderList: IVendorOrder[] = [];

    cart.forEach((toy) => {
        const existingOrder = orderList.find(order => order.brand === toy.brand && order.subBrand === toy.subBrand);
        if (existingOrder) {
            existingOrder.listOfToysSentLink.push({
                toy: toy.toyId,
                quantity: toy.quantity
            });
        } else {
            orderList.push({
                brand: toy.brand,
                subBrand: toy.subBrand,
                listOfToysSentLink: [{
                    toy: toy.toyId,
                    quantity: toy.quantity
                }],
                status: [],
                type: orderType,
                address: address
            });
        }
    });

    const session = await VendorOrderModel.startSession();
    session.startTransaction();
    try {
        // Save all orders in parallel
        const saveOperations = orderList.map(order =>
            new VendorOrderModel(order).save({ session })
        );

        await Promise.all(saveOperations);

        await session.commitTransaction();
        session.endSession();
        res.status(201).json({ message: 'Order placed successfully' });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        throw createHttpError(500, 'Internal Server Error. Please try again later.');
    }
});

export const updateOrderById = expressAsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { order } = req.body; // This contains the fields to be updated

    try {
        const updatedOrder = await VendorOrderModel.findByIdAndUpdate(
            id,
            { $set: order },
            { new: true, runValidators: true } // Return the updated document and run validators
        );

        if (!updatedOrder) {
            throw createHttpError(404, 'Order not found');
        }

        res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
    } catch (error) {
        console.error(error);
        throw createHttpError(500, 'Internal Server Error. Please try again later.');
    }
});

export const getOrders = expressAsyncHandler(async (req: Request, res: Response) => {
    const { brand, subBrand, status } = req.query;
    // Validate level
    if (status && !Object.values(VendorOrderStatus).includes(status as VendorOrderStatus)) {
        // If the level is invalid, return a 400 error
        throw createHttpError(400, 'Invalid level parameter.');
    }
    // Create a filter object
    const filter: { [key: string]: any } = {};

    if (brand) {
        filter.brand = brand;
    }

    if (subBrand) {
        filter.subBrand = subBrand;
    }

    if (status) {
        filter['status.status'] = status;
    }

    const orders = await VendorOrderModel.find(filter);

    res.status(200).json(orders);

});

export const getOrderById = expressAsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = await VendorOrderModel.findById(id).populate('listOfToysSentLink.toy');;
    if (!order) {
        throw createHttpError(404, 'Order not found');
    }
    res.status(200).json(order);
});

export const deleteOrderById = expressAsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    checkMogooseId(id, 'order');
    const deletedOrder = await VendorOrderModel.findByIdAndDelete(id);

    if (!deletedOrder) {
        throw createHttpError(404, 'Order is not found.');
    }

    res.status(200).json({ message: 'Order deleted successfully.' });
});