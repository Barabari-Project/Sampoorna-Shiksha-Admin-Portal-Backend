import { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { tokenGenerator } from '../utils/token.js';

export const signIn = expressAsyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (email == process.env.CLIENT_EMAIL && password == process.env.CLIENT_PASSWORD) {
        const token = tokenGenerator({ email });
        res.status(200).json({ token, message: 'Logged in successfully.' });
    } else {
        res.status(401).json({ message: 'Invalid Credentials.' });
    }
});