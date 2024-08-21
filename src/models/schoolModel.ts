import mongoose, { Schema } from 'mongoose';
import { ISchool } from '../utils/types.js'; // Adjust the path as needed
import moment from 'moment-timezone';

const schoolSchema: Schema<ISchool> = new Schema({
    code: {
        type: String,
        unique: true
    },
    timestamp: {
        type: String,
    },
    nameOfSchoolInstitution: {
        type: String,
    },
    boardAffiliatedAndMediumOfInstruction: {
        type: String,
    },
    typeOfInstitutionSchool: {
        type: String,
    },
    villageNameIfAny: {
        type: String,
    },
    district: {
        type: String,
    },
    state: {
        type: String,
    },
    fullAddressWithPinCode: {
        type: String,
    },
    nameOfPrincipalAndManagement: {
        type: String,
    },
    contactNumberOfPrincipalManagement: {
        type: String,
    },
    nameOfCoordinatorForLibrary: {
        type: String,
    },
    contactDetailsOfCoordinatorTeacher: {
        type: String,
    },
    isThereCupboardForSafekeeping: {
        type: Boolean,
    },
    isThereRoomForLibrary: {
        type: Boolean,
    },
    picturesOfLibraryRoomAndCupboard: {
        type: String,
    },
    cupboardPictures: {
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
schoolSchema.virtual('createdAtIST').get(function () {
    return moment(this.createdAt).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
});

// Define a virtual for updatedAtIST
schoolSchema.virtual('updatedAtIST').get(function () {
    return moment(this.updatedAt).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
});

const SchoolModel = mongoose.model<ISchool>('School', schoolSchema);

export default SchoolModel;