import mongoose from 'mongoose';

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
        }
    },
    { timestamps: true }
);

userSchema.statics.findByLogin = async function(login) {
    return await this.findOne({ $or: [{ username: login, email: login }]});
}

userSchema.pre('remove', function(next) {
    this.model('Message').deleteMany({ user: this._id }, next);
});

const User = mongoose.model('User', userSchema);
export default User;