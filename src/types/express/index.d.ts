import 'express';

declare module 'express' {
    export interface Request {
        username?: string;
    }
}