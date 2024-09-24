import { Document, model, models, Schema } from "mongoose";

interface IAuthState extends Document {
    state: string;
    expiresAt: Date;
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
}, { collection: 'auth-state' });

const AuthState = models?.AuthState || model<IAuthState>("AuthState", AuthStateSchema);

export default AuthState;
