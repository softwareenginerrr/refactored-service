import 'dotenv/config'

export const config = {
    PORT: process.env.PORT ?? '8080',
    MONGO_URI: process.env.MONGO_DB_URI ?? '',
}