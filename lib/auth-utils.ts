import { MongooseError, Error as MongooseErrorBase } from 'mongoose';
import crypto from "crypto";
import { v4 as uuidv4 } from 'uuid';
interface ValidationErrorDetails {
    [key: string]: {
        properties: {
            path: string;
        };
        message: string;
    };
}

export interface MongooseErrorExtended extends MongooseErrorBase {
    errors?: ValidationErrorDetails;
    code?: number;
}

const mongooseError = (err: MongooseErrorExtended) => {
    console.log(`Error code: ${err.code}`);
    console.log(`Error message: ${err.message}`);
    console.log(err.errors);

    let errors: Record<string, string | undefined> = {
        username: undefined,
        email: undefined,
        password: undefined
    };

    if (err.code === 11000) {
        errors.email = "Email is already registered";
        return errors;
    }

    if (err.message.includes("validation failed") || err.message.includes("Validation failed")) {
        if (err.errors) {
            Object.values(err.errors).forEach((error) => {
                if (error && error.properties && typeof error.properties.path === 'string') {
                    errors[error.properties.path] = error.message;
                }
            });
        }
        return errors;
    }

    return ;
}
const otpGenerator = () => {
    const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    const expiresAt = new Date(Date.now() + 3600000);

    return { verificationCode, expiresAt }
}
const idGenerator = () => {
    const verificationCode = uuidv4();
    const expiresAt = new Date(Date.now() + 3600000);

    return { verificationCode, expiresAt }
}


export {
    mongooseError, otpGenerator, idGenerator
}