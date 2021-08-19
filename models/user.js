import Mongoose from 'mongoose';
import Bcrypt from 'bcrypt';

import { logger } from '../config/logger.js';
import MessageModel from '../models/message.js';

const userSchema = new Mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

userSchema.statics.findByLogin = async function(login) {
    return await this.findOne({ $or: [{ username: login },{ email: login }]});
}

userSchema.methods.isValidPassword = async function(password) {
    return await Bcrypt.compare(password, this.password);
}

userSchema.pre('save', async function(next) {
    logger.database(`hashing ${this.username} password`)
    this.password = await Bcrypt.hash(this.password, 10);
    next();
});

userSchema.pre('remove', async function(next) {
    logger.database(`pre remove user hook - username: ${this.username}`);
    MessageModel.deleteMany({ user: this._id }, next);
});

const User = Mongoose.model('User', userSchema);
export default User;