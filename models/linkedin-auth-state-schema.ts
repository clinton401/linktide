import { Document, model, models, Schema } from "mongoose";

interface ILinkedinAuthState extends Document {
    state: string;
    expiresAt: Date;
}

const LinkedinAuthStateSchema = new Schema<ILinkedinAuthState>({
    state: {
        type: Schema.Types.String,
        required: true,
        unique: true,
    },
    expiresAt: {
        type: Schema.Types.Date,
        required: true,
    },
    
}, { collection: 'linkedin-auth-state' });

// const LinkedInAuthState = models?.LinkedInAuthState || model<ILinkedinAuthState>("AuthState", LinkedinAuthStateSchema);
const LinkedInAuthState =
    models.LinkedInAuthState || model<ILinkedinAuthState>("LinkedInAuthState", LinkedinAuthStateSchema);

export default LinkedInAuthState;
