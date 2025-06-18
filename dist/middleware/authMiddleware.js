import expressAsyncHandler from 'express-async-handler';
import { verifyJwtToken } from '../utils/token.js';
import createHttpError from 'http-errors';
export const authMiddleware = expressAsyncHandler(async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        throw createHttpError(401, 'Please Login.');
    }
    const tokenString = token.replace('Bearer ', '');
    let decoded = null;
    try {
        // Verify token
        decoded = await verifyJwtToken(tokenString);
    }
    catch (error) {
        throw createHttpError(401, 'Please Login.');
    }
    // If token is valid, proceed to next middleware or route handler
    next();
});
//# sourceMappingURL=authMiddleware.js.map