import mongoose from 'mongoose';

export default class Database {
    async load() {
        await mongoose.connect(process.env.DATABASE_URL);
    }
}
