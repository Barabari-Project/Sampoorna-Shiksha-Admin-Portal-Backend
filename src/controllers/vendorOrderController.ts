import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import VendorOrderModel from '../models/vendorOrderModel.js';
import createHttpError from 'http-errors';
import { IVendorOrder, VendorCartItem, VendorOrderStatus, VendorOrderType } from '../utils/types.js';
import { checkMogooseId } from '../utils/validation.js';
import { Types } from 'mongoose';
import SchoolModel from '../models/schoolModel.js';

export const placeOrder = expressAsyncHandler(async (req: Request, res: Response) => {
    const { cart, from, to, schoolId }: { cart: VendorCartItem[], from: string, to: string, schoolId: Types.ObjectId | undefined } = req.body;

    cart.forEach((toy) => {
        checkMogooseId(toy.toyId, 'toy');
        const parsedQuantity = Number(toy.quantity);
        if (!Number.isInteger(parsedQuantity) || parsedQuantity < 0) {
            throw createHttpError(400, 'Quantity must be a valid non-negative integer.');
        }
    });

    const orderList: IVendorOrder[] = [];

    if (to == 'school') {
        checkMogooseId(schoolId, 'School');
        const isSchoolExists = SchoolModel.exists({ _id: schoolId });
        if (!isSchoolExists) {
            throw createHttpError(400, 'School is not exists with give id');
        }
    }

    if (from != 'vendor') {
        orderList.push({
            listOfToysSentLink: [],
            status: [{
                status: VendorOrderStatus.PENDING
            }],
            school: schoolId,
            from,
            to
        });
        cart.forEach((toy) => {
            orderList[0].listOfToysSentLink.push({
                toy: toy.toyId,
                quantity: toy.quantity,
                price: toy.price
            })
        });
    } else {
        cart.forEach((toy) => {
            const existingOrder = orderList.find(order => order.brand === toy.brand && order.subBrand === toy.subBrand);
            if (existingOrder) {
                existingOrder.listOfToysSentLink.push({
                    toy: toy.toyId,
                    quantity: toy.quantity,
                    price: toy.price
                });
            } else {
                orderList.push({
                    brand: toy.brand,
                    subBrand: toy.subBrand,
                    listOfToysSentLink: [{
                        toy: toy.toyId,
                        quantity: toy.quantity,
                        price: toy.price
                    }],
                    status: [{
                        status: VendorOrderStatus.PENDING
                    }],
                    from,
                    to,
                    school: schoolId
                });
            }
        });
    }

    // const session = await VendorOrderModel.startSession();
    // session.startTransaction();
    try {
        const saveOperations = orderList.map(order =>
            // new VendorOrderModel(order).save({ session })
            new VendorOrderModel(order).save()
        );
        await Promise.all(saveOperations);
        // await session.commitTransaction();
        // session.endSession();
        res.status(201).json({ message: 'Order placed successfully' });
    } catch (error) {
        console.error('Error while saving order.', error);
        throw createHttpError(500, 'Internal Server Error. Please try again later.');
    } finally {
        // session.endSession();
    }
});

export const updateOrderById = expressAsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { order } = req.body; // This contains the fields to be updated

    try {
        delete order._id;
        delete order.id;
        delete order.__v;
        const updatedOrder = await VendorOrderModel.findByIdAndUpdate(
            id,
            { $set: order },
            { new: true, runValidators: true } // Return the updated document and run validators
        ).populate('listOfToysSentLink.toy');

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
    // const { brand, status, from,to } = req.query;
    // Validate level
    // if (status && !Object.values(VendorOrderStatus).includes(status as VendorOrderStatus)) {
    //     // If the level is invalid, return a 400 error
    //     throw createHttpError(400, 'Invalid level parameter.');
    // }
    // // Create a filter object
    // const filter: { [key: string]: any } = {};

    // if (brand) {
    //     filter.brand = { $regex: brand, $options: 'i' };
    // }

    // if (brand) {
    //     filter.subBrand = { $regex: brand, $options: 'i' };
    // }

    // if (status) {
    //     filter['status.status'] = status;
    // }

    // if (from) {
    //     filter['from'] = from;
    // }
    // if(to){
    //     filter['to'] = to;
    // }

    const orders = await VendorOrderModel.find().populate('listOfToysSentLink.toy');

    res.status(200).json(orders);

});

export const getOrderById = expressAsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    checkMogooseId(id, 'Order');
    const order = await VendorOrderModel.findById(id).populate('listOfToysSentLink.toy');
    if (!order) {
        throw createHttpError(404, 'Order not found');
    }
    res.status(200).json(order);
});

export const getOrdersBySchoolId = expressAsyncHandler(async (req: Request, res: Response) => {
    const { schoolId } = req.params;
    checkMogooseId(schoolId, "School");
    try {
        const vendorOrders = await VendorOrderModel.find({ school: schoolId }).populate('listOfToysSentLink.toy');
        res.status(200).json(vendorOrders);
    } catch (error) {
        console.error('Error fetching vendor orders:', error);
        res.status(500).json({ message: 'An error occurred while fetching vendor orders.' });
    }
})

export const deleteOrderById = expressAsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    checkMogooseId(id, 'order');
    const deletedOrder = await VendorOrderModel.findByIdAndDelete(id);

    if (!deletedOrder) {
        throw createHttpError(404, 'Order is not found.');
    }

    res.status(200).json({ message: 'Order deleted successfully.' });
});