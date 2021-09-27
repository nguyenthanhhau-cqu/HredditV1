import { Connection, IDatabaseDriver, EntityManager } from "@mikro-orm/core";
import { Request, Response } from "express";
import { Session } from "express-session";
import { Redis } from "ioredis";


export type MyConText = {
    em: EntityManager<IDatabaseDriver<Connection>>;
    req: Request & { session?: Session & { userId?: number } };
    res: Response;
    redis: Redis
}