import mongoose from "mongoose";

export interface PermissionDocument extends mongoose.Document {
    type: string;
    text: string;
}

export const PermissionSchema = new mongoose.Schema<PermissionDocument>({
    type: {
        type: String,
        required: [true, 'Type is required']
    },
    text: {
        type: String,
        required: [true, 'Text is required']
    },
    votes: {
        type: Number,
        default: 0
    }
});

export default mongoose.model<PermissionDocument>('Permission', PermissionSchema);