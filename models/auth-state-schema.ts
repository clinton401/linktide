import { Document, model, models, Schema } from "mongoose";

interface IAuthState extends Document {
    state: string;
    expiresAt: Date;
    codeChallenge?: string;
}

const AuthStateSchema = new Schema<IAuthState>({
    state: {
        type: Schema.Types.String,
        required: true,
        unique: true,
    },
    expiresAt: {
        type: Schema.Types.Date,
        required: true,
    },
    codeChallenge: {
        type: Schema.Types.String,
        default: null
    },
}, { collection: 'auth-state' });

const AuthState = models?.AuthState || model<IAuthState>("AuthState", AuthStateSchema);

export default AuthState;
