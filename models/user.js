import mongoose from 'mongoose';
import { logger } from '../config/logger.js';

const userSchema = new mongoose.Schema(
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
        test: {
            type: String
        }
    },
    { timestamps: true }
);

userSchema.statics.findByLogin = async function(login) {
    return await this.findOne({ $or: [{ username: login },{ email: login }]});
}

userSchema.pre('remove', function(next) {
    logger.database(`remove user hook log + username: ${this.username}`);
    // this.model('Message').deleteMany({ user: this._id }, next);
});

const User = mongoose.model('User', userSchema);
export default User;