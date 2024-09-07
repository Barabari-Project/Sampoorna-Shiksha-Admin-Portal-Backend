import mongoose, { Schema } from 'mongoose';
import { Level, IToyModel } from '../utils/types.js';
import moment from 'moment-timezone';

const toySchema: Schema<IToyModel> = new Schema({
    // srNo: {
    //     type: Number,
    //     required: true,
    //     unique: true,
    // },
    brand: {
        type: String,
    },
    subBrand: {
        type: String,
    },
    name: {
        type: String,
    },
    price: {
        type: Number,
    },
    category: {
        type: String,
    },
    codeName: {
        type: String,
    },
    cataloguePgNo: {
        type: Number,
    },
    level: {
        type: String,
        enum: Level,
    },
    learn: {
        type: [String],
        default: []
    },
    link: {
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
toySchema.virtual('createdAtIST').get(function () {
    return moment(this.createdAt).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
});

// Define a virtual for updatedAtIST
toySchema.virtual('updatedAtIST').get(function () {
    return moment(this.updatedAt).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
});

// Create the model using the schema
const ToyModel = mongoose.model<IToyModel>('Toy', toySchema);

export default ToyModel;
