import { MyConText } from "src/types";
import { MiddlewareFn } from "type-graphql";



export const isAuth: MiddlewareFn<MyConText> = ({ context }, next) => {
    if (!context.req.session.userId) {
        throw new Error("this user is not authenticated")
    }
    return next()
}