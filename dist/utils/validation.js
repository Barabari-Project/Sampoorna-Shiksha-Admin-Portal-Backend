import createHttpError from "http-errors";
import { Types } from "mongoose";
export const checkMogooseId = (id, name) => {
    if (!Types.ObjectId.isValid(id)) {
        throw createHttpError(400, `Please give valid ${name} id.`);
    }
};
//# sourceMappingURL=validation.js.map