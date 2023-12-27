import mongoose from "mongoose";
import {LoggerService} from "./common/services/logger.service";

const loggerService = new LoggerService();
const initializeMongoose = async (MONGO_URI: string) => {
    try {
        await mongoose.connect(MONGO_URI);
        loggerService.info('MongoDB connected successfully')
    } catch (error: any) {
       loggerService.error('MONGO ERROR!', error);
    }
};

export default initializeMongoose;