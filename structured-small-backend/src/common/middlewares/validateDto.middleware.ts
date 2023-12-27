import { RequestHandler } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { sanitize } from 'class-sanitizer';
import { IDtoError } from '../interfaces/dtoError.interface';
import { ApiError } from '../helpers/apiError';
import {LoggerService} from "../services/logger.service";

function validateDto(type: any, skipMissingProperties = false): RequestHandler {
    return (req, res, next) => {
        const dtoObj = plainToInstance(type, req.body);
        validate(dtoObj, { skipMissingProperties }).then((errors: ValidationError[]) => {
            if (errors.length > 0) {
                const notValidFields: IDtoError = { dtoName: 'DtoNameIsNotFound', errors: [] };
                errors.forEach((error: ValidationError) => {
                    notValidFields.dtoName = error.target?.constructor.name ?? notValidFields.dtoName;
                    if (error.children && error.children.length > 0) {
                        error.children.forEach((children) => {
                            notValidFields.errors.push((Object as any).values(children.constraints).join(', '));
                        });
                    } else {
                        notValidFields.errors.push((Object as any).values(error.constraints).join(', '));
                    }
                });
                const loggerService = new LoggerService();
                loggerService.warn(`${notValidFields.dtoName} user transferred not valid fields`)
                return next(ApiError.BadRequestException('400 Bad request!', notValidFields));
            } else {
                sanitize(dtoObj);
                req.body = dtoObj;
                return next();
            }
        });
    };
}

export default validateDto;
