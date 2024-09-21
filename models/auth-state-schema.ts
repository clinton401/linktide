import { Document, model, models, Schema } from "mongoose";

interface IAuthState extends Document {
    state: string;
    expiresAt: Date;
}

const AuthStateSchema = new Schema<IAuthState>({
    state: {
        type: String,
        required: true,
        unique: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
}, { collection: 'auth-state' });

const AuthState = models?.AuthState || model<IAuthState>("AuthState", AuthStateSchema);

export default AuthState;
