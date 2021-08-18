import Mongoose from 'mongoose';
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
        test: {
            type: String
        }
    },
    { timestamps: true }
);

userSchema.statics.findByLogin = async function(login) {
    return await this.findOne({ $or: [{ username: login },{ email: login }]});
}

userSchema.pre('deleteOne', async function(next) {
    const username = this.getFilter().$or[0].username;
    logger.database(`pre remove user hook - username: ${username}`);

    const user = await this.model.findByLogin(username);
    MessageModel.deleteMany({ user: user._id }, next);
});

const User = Mongoose.model('User', userSchema);
export default User;