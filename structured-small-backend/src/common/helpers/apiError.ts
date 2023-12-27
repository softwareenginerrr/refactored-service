export class ApiError extends Error {
    public status: number;
    public errors: [];

    constructor(status: number, message: any, errors: any = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }
    static BadRequestException(message: any, errors: any = []) {
        return new ApiError(400, message, errors);
    }
    static UnauthorizedException() {
        return new ApiError(401, "401 Unauthorized!");
    }
    static ForbiddenExeption(message: any, errors: any = []) {
        return new ApiError(403, message, errors);
    }
    static NotFoundException(message: any, errors: any = []) {
        return new ApiError(404, message, errors);
    }
    static FatalError(message: any, errors: any = []){
        return new ApiError(500, message, errors)
    }
}
