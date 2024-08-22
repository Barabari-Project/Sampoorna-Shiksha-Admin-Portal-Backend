import mongoose, { Document, Schema } from 'mongoose';
import { IVendorOrder, VendorOrderStatus } from '../utils/types.js';
import moment from 'moment-timezone';

const vendorOrderSchema: Schema<IVendorOrder & Document> = new Schema({
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
    brand:{
        type:String
    },
    subBrand: {
        type: String
    },
    status: [
        {
            timestamps: {
                type: String,
            },
            personName: {
                type: String,
            },
            contactNumber: {
                type: String,
            },
            status: {
                type: String,
                enum: VendorOrderStatus
            }
        }
    ],
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
vendorOrderSchema.virtual('createdAtIST').get(function () {
    return moment(this.createdAt).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
});

// Define a virtual for updatedAtIST
vendorOrderSchema.virtual('updatedAtIST').get(function () {
    return moment(this.updatedAt).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
});

const VendorOrderModel = mongoose.model<IVendorOrder & Document>('VendorOrder', vendorOrderSchema);

export default VendorOrderModel;
