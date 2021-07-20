import crypto from 'crypto';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export interface UserDocument extends mongoose.Document {
    name: string;
    email: string,
    role: string,
    password: string,
    createdAt: Date
}

export const UserSchema = new mongoose.Schema<UserDocument>({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: [true, 'Email already registered'],
        match: [
            /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Entered email is invalid'
        ]
    },
    role: {
        type: String,
        enum: ['user', 'premium'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('save', async function(next){
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, "agenwmgt43809tg340jgr4ogjv0", {
       expiresIn: 30
    });
};

UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

export default mongoose.model<UserDocument>('User', UserSchema);