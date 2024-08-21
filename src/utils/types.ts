import moment from 'moment';
import mongoose, { Document, Types } from 'mongoose';

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

export interface ISchool extends Document {
    code: string;
    timestamp?: string;
    nameOfSchoolInstitution?: string;
    boardAffiliatedAndMediumOfInstruction?: string;
    typeOfInstitutionSchool?: string;
    villageNameIfAny?: string;
    district?: string;
    state?: string;
    fullAddressWithPinCode?: string;
    nameOfPrincipalAndManagement?: string;
    contactNumberOfPrincipalManagement?: string;
    nameOfCoordinatorForLibrary?: string;
    contactDetailsOfCoordinatorTeacher?: string;
    isThereCupboardForSafekeeping?: boolean;
    isThereRoomForLibrary?: boolean;
    picturesOfLibraryRoomAndCupboard?: string;
    cupboardPictures?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface SchoolDataFromExcelSheet {
    code: string;
    haveYouFilledTheFormInPast: boolean;
    timestamp: string;
    nameOfSchoolInstitution: string;
    boardAffiliatedAndMediumOfInstruction: string;
    typeOfInstitutionSchool: string;
    villageNameIfAny: string;
    district: string;
    state: string;
    fullAddressWithPinCode: string;
    nameOfPrincipalAndManagement: string;
    contactNumberOfPrincipalManagement: string;
    nameOfCoordinatorForLibrary: string;
    contactDetailsOfCoordinatorTeacher: string;
    isThereCupboardForSafekeeping: boolean;
    isThereRoomForLibrary: boolean;
    picturesOfLibraryRoomAndCupboard: string;
};

export interface OrderDataFromExcelSheet {
    code: string;
    timestamp: string;
    numberOfStudentsBalwadiClass1: Number;
    numberOfStudentsClass2To4: Number;
    numberOfStudentsClass5AndAbove: Number;
    referredBy: string;
}

export interface IOrder extends Document{
    timestamp?: string;
    school?: Types.ObjectId;
    numberOfStudentsBalwadiClass1?: number;
    numberOfStudentsClass2To4?: number;
    numberOfStudentsClass5AndAbove?: number;
    referredBy?: string;
    totalNumberOfToys?: number;
    listOfToysSentLink?: {
        toy: Types.ObjectId;
        quantity?: number;
    }[];
    dateOfDespatch?: string;
    modeOfDespatch?: string;
    trackingDetails?: string;
    dateOfDelivery?: string;
    photosVideosLink?: string;
    createdAt: Date;
    updatedAt: Date;
}


export enum Level {
    PRIMARY = 'PRIMARY',
    SECONDARY = 'SECONDARY',
    SENIOR_SECONDARY = 'SENIOR_SECONDARY',
    MIX = 'MIX',
    ALL = 'ALL'
}