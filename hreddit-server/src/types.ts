import { Request, Response } from "express";
import { Session } from "express-session";
import { Redis } from "ioredis";


export type MyConText = {
    req: Request & { session?: Session & { userId?: number } };
    res: Response;
    redis: Redis;
}