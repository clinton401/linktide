import { Error as MongooseErrorBase } from 'mongoose';
import crypto, { randomBytes } from "crypto";
import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';
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

    const errors: Record<string, string | undefined> = { // Change from let to const
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

    return;
};

const otpGenerator = (is10Mins?: boolean) => {
    const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    const additionNumber = is10Mins ? 600000 : 3_600_000;
    const expiresAt = new Date(Date.now() + additionNumber);

    return { verificationCode, expiresAt };
};

const idGenerator = () => {
    const verificationCode = uuidv4();
    const expiresAt = new Date(Date.now() + 3600000);

    return { verificationCode, expiresAt };
};

const generateRandomState = (length = 16) => {
    const state = randomBytes(length).toString('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    return { state, expiresAt };
};
const isExpired = () => {

}
function generateRandomString(length: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  
  function generateCodeChallenge(codeVerifier: string): string {
    // Generate the SHA-256 hash and convert it to a hex string
    const codeChallenge = CryptoJS.SHA256(codeVerifier).toString(CryptoJS.enc.Hex);
    return codeChallenge;
  }
  
  // Example usage
  const codeVerifier = generateRandomString(128);
  const codeChallenge = generateCodeChallenge(codeVerifier);
  
  
  

export {
    mongooseError, otpGenerator, idGenerator, generateRandomState, isExpired, codeChallenge
};
