import { Document } from 'mongoose';

export interface IToyModel extends Document {
    srNo: number;
    brand: string;
    subBrand: string;
    name: string;
    price: number;
    category: string;
    codeName: string;
    level: Level;
    learn: string[];
    link: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ISchoolInformation extends Document {
    timestamp?: string;
    nameOfSchool?: string;
    boardAffiliatedTo?: string;
    mediumOfInstruction?: string;
    typeOfInstitution?: string;
    villageName?: string;
    district?: string;
    state?: string;
    fullAddress?: string;
    nameOfPrincipal?: string;
    management?: string;
    principalContactNumber?: string;
    coordinatorName?: string;
    coordinatorContactDetails?: string;
    hasCupboardForToys?: boolean;
    hasRoomForLibrary?: boolean;
    libraryRoomPictures?: string;
    cupboardPictures?: string;
    numberOfStudentsBalwadiToClass1?: number;
    numberOfStudentsClass2ToClass4?: number;
    numberOfStudentsClass5AndAbove?: number;
    referredBy?: string;
    totalNumberOfToys?: number;
    listOfToysSentLink?: string[];
    dateOfDespatch?: string;
    modeOfDespatch?: string;
    trackingDetails?: string;
    dateOfDelivery?: string;
    photosVideosLink?: string;
}

export enum Level {
    PRIMARY = 'PRIMARY',
    SECONDARY = 'SECONDARY',
    SENIOR_SECONDARY = 'SENIOR_SECONDARY',
    MIX = 'MIX',
    ALL = 'ALL'
}