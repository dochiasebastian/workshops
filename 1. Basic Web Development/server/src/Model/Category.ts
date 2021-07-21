import mongoose from "mongoose";

export interface CategoryDocument extends mongoose.Document {
    text: string;
}

export const CategorySchema = new mongoose.Schema<CategoryDocument>({
    text: {
        type: String,
        required: [true, 'Text is required'],
        unique: [true, 'CAtegory already exists'],
    }
});

export default mongoose.model<CategoryDocument>('Category', CategorySchema);