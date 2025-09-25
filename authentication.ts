import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AdminWithUser } from './models/Admin';
import { LoginForm, User } from './models/User';
import adminService from './database/services/adminService'; // Corrigir o import
import userService from './database/services/userService';
import 'dotenv/config';

const { AES_KEY, ALGORITHM, JWT_SECRET } = process.env;
if (!AES_KEY || !ALGORITHM || !JWT_SECRET) {
    throw new Error('Enviroment variables not defined');
}

function generateIV(): Buffer {
    return crypto.randomBytes(16);
}

export default {

    /**
     * Compare user passwords.
     * -
     * @param hashedPass - The string containing user hashed password.
     * @param plainPass - The string containing user plain password.
     * @returns True if passwords match, false otherwise.
     */
    comparePassword: async (plainPass: string, hashedPass: string): Promise<boolean> => {
        try {
            return await bcrypt.compare(plainPass, hashedPass);
        } catch (error: any) {
            console.error(error.message || error);
            throw new Error('Password don\'t match');
        }
    },

    /**
     * Encrypt text using AES encryption.
     * This function encrypts the given text using AES encryption with a dynamically
     * generated initialization vector (IV).
     *
     * @param textToEncrypt - The string to be encrypted.
     * @returns The encrypted text, including the IV in base64 format and the encrypted
     * text in base64 format.
     */
    encryptAES: (textToEncrypt: string): string => {
        const iv = generateIV();
        const cipher = crypto.createCipheriv(
            ALGORITHM,
            crypto.scryptSync(AES_KEY, 'salt', 32),
            iv,
        );
        return `${iv.toString('base64')}:${cipher.update(textToEncrypt, 'utf8', 'base64')
            + cipher.final('base64')}`;
    },

    /**
     * Decrypt text using AES decryption.
     * This function decrypts the given encrypted text using AES decryption with the
     * initialization vector (IV) embedded in the encrypted text.
     *
     * @param textToDecrypt - The string to be decrypted, including the IV and the
     * encrypted text.
     * @returns The decrypted text in UTF-8 format.
     */
    decryptAES: (textToDecrypt: string): string => {
        const [ivBase64, encryptedBase64] = textToDecrypt.split(':');
        const iv = Buffer.from(ivBase64, 'base64');
        return crypto
            .createDecipheriv(ALGORITHM, AES_KEY, iv)
            .update(encryptedBase64, 'base64', 'utf8')
            + crypto.createDecipheriv(ALGORITHM, AES_KEY, iv).final('utf8');
    },

    /**
    * Handles user login.
    * -
    * @param req - The request object containing login details.
    * @param res - The response object to send the result.
    * @returns The token if login is successful, or an error message if not.
    */
    login: async (req: Request, res: Response): Promise<void> => {
        if (!req.body) {
            res.status(400).json({
                error: 'Request data is incorrect or unfulfilled',
            }); return;
        }

        const loginForm: LoginForm = req.body;
        if (!loginForm.email || !loginForm.password) {
            res.status(400).json({
                error: 'Email or password is missing',
            }); return;
        }
        try {
            const user: User | null = await userService
                .getByEmail(loginForm.email);
            if (!user) {
                res.status(404).json({
                    error: 'User not found',
                }); return;
            }

            if (!await bcrypt.compare(loginForm.password, user.password)) {
                res.status(401).json({
                    error: 'Access denied: Invalid password',
                }); return;
            }

            let admin: AdminWithUser | null = null;

            if (user.isAdmin) {
                admin = await adminService.getByUserId(String(user.id));
                if (!admin) {
                    res.status(404).json({
                        error: 'User data not found',
                    }); return;
                }
            }

            const JWTPayload = {
                id: user.id,
                isAdmin: user.isAdmin,
                ...(user.isAdmin && admin ? {
                } : {})
            };

            const token: string = jwt.sign(JWTPayload, process.env.JWT_SECRET!, {
                expiresIn: 604800, // 1 week
            });
            res.cookie('cookie', token, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: '/',
                sameSite: 'none',
                secure: true,
                signed: true,
            });
            res.status(200).json({ token });
        } catch (error: any) {
            console.error('Error logging in user:', error.message);
            const statusCode = error.status || 500;
            const errorDetails = {
                details: error.message || 'An unexpected error occurred',
                error: 'Failed to log in',
            };
            res.status(statusCode).json(errorDetails);
        }
    },

    /**
     * Hashes user password.
     * -
     * @param plainPass - The string containing user password.
     * @returns The hashed password string if  successful, or an error message if not.
     */
    hashPassword: async (plainPass: string): Promise<string> => {
        try {
            return await bcrypt.hash(plainPass, 12);
        } catch (error: any) {
            console.error(error.message || error);
            throw new Error('Error hashing password');
        }
    },

    /**
    * Middleware to check user permissions for a specific module and action.
    * -
    * @param module - The module to check permissions for.
    * @param action - The action to check permissions for.
    * @returns Middleware function to check user permissions.
    */
    permissionMiddleware() {
        return async (req: Request, res: Response, next: NextFunction) => {
            if (!req?.headers?.['x-access-token']) {
                res.status(400).json({
                    error: 'Request data is incorrect or unfulfilled',
                }); return;
            }

            const token = req.headers['x-access-token'] as string;
            const decodedToken = this.verifyToken(token);
            if (!decodedToken) {
                res.status(403).json({
                    error: 'Token is expired or invalid',
                }); return;
            }
            try {
                const user: User | null = await userService.getById(String(decodedToken.id));
                if (!user) {
                    res.status(404).json({
                        error: 'User not found',
                    }); return;
                }
                if (user.isAdmin) {
                    next(); return;
                }
                next();
            } catch (error: any) {
                console.error('Error checking permission', error.message);
                const statusCode = error.status || 500;
                const errorDetails = {
                    details: error.message || 'An unexpected error occurred',
                    error: 'Failed to check permission',
                };
                res.status(statusCode).json(errorDetails);
            }
        };
    },

    verifyJWT: async (req: Request, res: Response, next: NextFunction) => {
        if (!req?.headers?.['x-access-token']
            && !req.signedCookies?.cookie) {
            res.status(400).json({
                error: 'Request data is incorrect or unfulfilled',
            }); return;
        }
        const token = req.headers['x-access-token']
            ? req.headers['x-access-token']
            : req.signedCookies.cookie;
        try {
            jwt.verify(token as string, JWT_SECRET!);
            next();
        } catch (error: any) {
            console.error('Error validating JWT:', error.message);
            const statusCode = error.status || 401;
            const errorDetails = {
                details: error.message || 'An unexpected error occurred',
                error: 'Failed to validate JWT',
            };
            res.status(statusCode).json(errorDetails);
        }
    },

    /**
     * Verifies the provided JWT token.
     * -
     * @param token - The JWT token to verify.
     */
    verifyToken: (token: string): JwtPayload => {
        try {
            return jwt.verify(token, JWT_SECRET!) as JwtPayload;
        } catch (error: any) {
            console.error(error.message || error);
            throw new Error('Invalid or expired token');
        }
    },
};