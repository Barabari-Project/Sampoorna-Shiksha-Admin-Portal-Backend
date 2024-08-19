export interface IToyModel extends Document {
    srNo: number;
    brand: string;
    subBrand: string;
    name: string;
    price: number;
    category: string;
    level: Level;
    learn: string[];
    link: string;
    createdAt: Date;
    updatedAt: Date;
}

export enum Level {
    PRIMARY = 'PRIMARY',
    SECONDARY = 'SECONDARY',
    SENIOR_SECONDARY = 'SENIOR_SECONDARY',
    MIX = 'MIX'
}