import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import createHttpError from 'http-errors';
import { SchoolDataFromExcelSheet } from '../utils/types.js';
import SchoolModel from '../models/schoolModel.js';
import mongoose from 'mongoose';
dotenv.config();

const RESPONSES_SHEET_ID: string = process.env.RESPONSES_SHEET_ID;

const serviceAccountAuth = new JWT({
    email: 'sampoorna-shiksha@some-new-420617.iam.gserviceaccount.com',
    key: process.env.GOOGLE_PRIVATE_KEY,
    scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
    ],
});

const readColumns = (row: any) => {
    const data: SchoolDataFromExcelSheet = {
        code: row.get('Code'),
        haveYouFilledTheFormInPast: row.get('Have you filled the form in past?').toLowerCase() === 'yes' ? true : false,
        timestamp: row.get('Timestamp'),
        nameOfSchoolInstitution: row.get('Name of the school/Institution'),
        boardAffiliatedAndMediumOfInstruction: row.get('Board affiliated to and Medium of instruction'),
        typeOfInstitutionSchool: row.get('Type of institution/school'),
        villageNameIfAny: row.get('Village name  if any'),
        district: row.get('District'),
        state: row.get('State'),
        fullAddressWithPinCode: row.get('Full address with pin code'),
        nameOfPrincipalAndManagement: row.get('Name of the Principal and Management'),
        contactNumberOfPrincipalManagement: row.get('Contact number of the Principal/Management'),
        nameOfCoordinatorForLibrary: row.get('Name of the teacher/coordinator for training and managing the library'),
        contactDetailsOfCoordinatorTeacher: row.get('Contact details of the coordinator/teacher'),
        isThereCupboardForSafekeeping: row.get('Is there a cupboard/place for safekeeping of the toys').toLowerCase() === 'yes' ? true : false,
        isThereRoomForLibrary: row.get('Is there a room /place to set up the library').toLowerCase() === 'yes' ? true : false,
        picturesOfLibraryRoomAndCupboard: row.get('Pictures of the library room and cupboard'), // This can be an array if multiple pictures are allowed
        // numberOfStudentsBalwadiClass1: row.get('Number of Students - Balwadi - class 1'),
        // numberOfStudentsClass2To4: row.get('Number of Students - class 2 - class 4'),
        // numberOfStudentsClass5AndAbove: row.get('Number of Students - class 5 and above'),
        // referredBy: row.get('Referred by'),
    };
    return data;
};

const storeDataToTheDatabase = async (data: SchoolDataFromExcelSheet) => {
    console.log(data);
    const data1 = await (new SchoolModel(data)).save();
    console.log(data1);
};

const readDataFromSheet = async () => {
    const doc = new GoogleSpreadsheet(RESPONSES_SHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    let sheet = doc.sheetsByIndex[0];

    let rows = await sheet.getRows();

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (row) {
            const completed = row.get('Completed');
            if (!completed) {
                const data: SchoolDataFromExcelSheet = readColumns(row);
                await storeDataToTheDatabase(data);
                row.set('Completed', 'True');
                await row.save(); // think about this I want gurrented success over here
            }
        }
    }
}

export const addSchoolData = expressAsyncHandler(async (req: Request, res: Response) => {
    await readDataFromSheet();
    res.sendStatus(200);
});

export const updateSchoolData = expressAsyncHandler(async (req: Request, res: Response) => {
    const { school } = req.body;
    const schoolId = school.id;
    if (!mongoose.Types.ObjectId.isValid(schoolId)) {
        throw createHttpError(400, 'Invalid Toy ID.');
    }
    delete school.id;
    const updatedSchool = await SchoolModel.findByIdAndUpdate(schoolId, school, {
        new: true, // Return the updated document
        runValidators: true, // Run schema validators on the updated fields
    });

    if (!updatedSchool) {
        // If no toy is found with the provided ID, return a 404 error
        throw createHttpError(404, 'School not found.');
    }

    // Send the updated toy as a response
    res.status(200).json({ message: 'School updated successfully!', school: updatedSchool });
});

export const getSchools = expressAsyncHandler(async (req: Request, res: Response) => {
    const { code, nameOfSchoolInstitution } = req.query;

    // Create a filter object
    const filter: { [key: string]: any } = {};

    if (code) {
        filter.brand = code;
    }

    if (nameOfSchoolInstitution) {
        filter.level = nameOfSchoolInstitution;
    }

    // Find schools that match the specified brand and level
    const schools = await SchoolModel.find(filter);

    // Send the filtered schools as a response
    res.status(200).json({ schools });
});

export const getSchoolById = expressAsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params; // Extract the school ID from the request parameters

    // Find the school by its ID
    const school = await SchoolModel.findById(id);

    if (!school) {
        // If no school is found with the provided ID, return a 404 error
        throw createHttpError(404, 'School not found.');
    }

    // Send the found school as a response
    res.status(200).json({ school });
});

export const deleteSchoolById = expressAsyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params; // Extract the school ID from the request parameters

    // Find the school by ID and delete it
    const deletedSchool = await SchoolModel.findByIdAndDelete(id);

    if (!deletedSchool) {
        // If no school is found with the provided ID, return a 404 error
        throw createHttpError(404, 'School not found.');
    }

    // Send a success response
    res.status(200).json({ message: 'School deleted successfully!', school: deletedSchool });
});