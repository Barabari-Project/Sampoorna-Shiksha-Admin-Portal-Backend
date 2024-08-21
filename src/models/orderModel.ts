import mongoose, { Schema } from 'mongoose';
import { IOrder } from '../utils/types.js';
import moment from 'moment-timezone';

const orderSchema: Schema<IOrder> = new Schema({
    timestamp: {
        type: String,
    },
    school: {
        type: Schema.Types.ObjectId,
        ref: 'School',
    },
    numberOfStudentsBalwadiClass1: {
        type: Number,
    },
    numberOfStudentsClass2To4: {
        type: Number,
    },
    numberOfStudentsClass5AndAbove: {
        type: Number,
    },
    referredBy: {
        type: String,
    },
    totalNumberOfToys: {
        type: Number,
    },
    listOfToysSentLink: [
        {
            toy: {
                type: Schema.Types.ObjectId,
                ref: 'Toy',
            },
            quantity: {
                type: Number,
            }
        }
    ],
    dateOfDespatch: {
        type: String,
    },
    modeOfDespatch: {
        type: String,
    },
    trackingDetails: {
        type: String,
    },
    dateOfDelivery: {
        type: String,
    },
    photosVideosLink: {
        type: String,
    },
    createdAt: {
        type: Date,
        select: false
    },
    updatedAt: {
        type: Date,
        select: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Define a virtual for createdAtIST
orderSchema.virtual('createdAtIST').get(function () {
    return moment(this.createdAt).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
});

// Define a virtual for updatedAtIST
orderSchema.virtual('updatedAtIST').get(function () {
    return moment(this.updatedAt).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
});

const OrderModel = mongoose.model<IOrder>('Order', orderSchema);

export default OrderModel;
