import mongoose, { Schema } from 'mongoose';
import { ISchoolInformation } from '../utils/types.js'; // Adjust the path as needed

const schoolSchema: Schema<ISchoolInformation> = new Schema({
    timestamp: {
        type: String,
    },
    nameOfSchool: {
        type: String,
    },
    boardAffiliatedTo: {
        type: String,
    },
    mediumOfInstruction: {
        type: String,
    },
    typeOfInstitution: {
        type: String,
    },
    villageName: {
        type: String,
    },
    district: {
        type: String,
    },
    state: {
        type: String,
    },
    fullAddress: {
        type: String,
    },
    nameOfPrincipal: {
        type: String,
    },
    management: {
        type: String,
    },
    principalContactNumber: {
        type: String,
    },
    coordinatorName: {
        type: String,
    },
    coordinatorContactDetails: {
        type: String,
    },
    hasCupboardForToys: {
        type: Boolean,
    },
    hasRoomForLibrary: {
        type: Boolean,
    },
    libraryRoomPictures: {
        type: String,
    },
    cupboardPictures: {
        type: String,
    },
    numberOfStudentsBalwadiToClass1: {
        type: Number,
    },
    numberOfStudentsClass2ToClass4: {
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
    listOfToysSentLink: {
        type: [String],
    },
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
});

const SchoolModel = mongoose.model<ISchoolInformation>('School', schoolSchema);

export default SchoolModel;