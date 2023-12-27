import { ApiError } from "../helpers/apiError";
import {Request, Response, Errback, NextFunction} from "express";
import {LoggerService} from "../services/logger.service";
function exceptionsMiddleware(
    err: Errback | ApiError | Error,
    req: Request,
    res: Response,
    next: NextFunction,
){
    if (err instanceof ApiError) {
        return res.status(err.status).send({message: err.message, errors: err.errors})
    }
    const logger = new LoggerService();
    logger.error('Fatal Error', err as Error);
    return res.status(500).send({message: 'Internal Server Error'})
}
export default exceptionsMiddleware;
