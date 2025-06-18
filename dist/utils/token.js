import jwt from 'jsonwebtoken';
export const tokenGenerator = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION_TIME });
};
export const verifyJwtToken = async (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};
export const decodeJwtToken = (token) => {
    return jwt.decode(token);
};
//# sourceMappingURL=token.js.map