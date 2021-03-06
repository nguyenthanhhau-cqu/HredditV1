import { MyConText } from "src/types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { User } from "../entities/User";
import * as argon2 from "argon2";
import { v4 } from "uuid";
import { sendEmail } from "../utils/sendEmail"
import { FORGET_PASSWORD_PREFIX } from "../utils/prefix"




@ObjectType()
export class ErrorType {
    @Field()
    fieldName: string
    @Field()
    errorMessage: string
}

@ObjectType()
export class UserRespond {

    @Field(() => [ErrorType], { nullable: true })
    errors?: ErrorType[]

    @Field(() => User, { nullable: true })
    user?: User
}

@InputType()
export class UserInput {
    @Field()
    userName: string
    @Field()
    passWord: string
    @Field()
    email: string
}


@Resolver()
export class UserResolver {
    @Mutation(() => UserRespond)
    async changePassword(
        @Arg('token') token: string,
        @Arg('newPassword') newPassword: string,
        @Ctx() { req, redis }: MyConText
    ): Promise<UserRespond> {
        if (newPassword.length <= 3) {
            return {
                errors: [{
                    fieldName: "newPassword",
                    errorMessage: "Your password must greater then 3 character"
                }]
            }
        }
        const userId = await redis.get(FORGET_PASSWORD_PREFIX + token)

        if (!userId) {
            return {
                errors: [{
                    fieldName: "token",
                    errorMessage: "Token is invalid"
                }]
            }
        }
        const userIdNum = parseInt(userId)
        const user = await User.findOne({ where: { id: userIdNum } })

        if (!user) {
            return {
                errors: [{
                    fieldName: "token",
                    errorMessage: "Your account must not exist"
                }]
            }
        }
        await User.update({ id: userIdNum }, { passWord: await argon2.hash(newPassword) });

        //login them after they successful update their password

        req.session.userId = user.id //create session to logon to user after they success change their password

        redis.del(FORGET_PASSWORD_PREFIX + token) //delete token in Redis 

        return { user }
    }

    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg("email") email: string,
        @Ctx() { redis }: MyConText
    ) {

        const user = await User.findOne({ where: { email: email } })
        if (!user) {
            return true
        }
        const token = v4()

        await redis.set(FORGET_PASSWORD_PREFIX + token, user.id, "ex", 1000 * 60 * 60 * 24 * 3) //3days

        await sendEmail(email, `<a href="http://localhost:3000/change-password/${token}">reset password</a>`)

        return true;
    }


    @Query(() => User, { nullable: true })
    me(@Ctx() { req, }: MyConText) {
        // you are not logged in
        if (!req.session.userId) {
            return null;
        }

        return User.findOne(req.session.userId)
    }

    @Mutation(() => UserRespond)
    async register(
        @Arg("options") options: UserInput,
        @Ctx() { req }: MyConText
    ): Promise<UserRespond> {
        if (!options.email.includes("@")) {
            return {
                errors: [{
                    fieldName: "email",
                    errorMessage: "you must enter an email"
                }]
            }
        }
        if (options.userName.includes("@")) {
            return {
                errors: [{
                    fieldName: "userName",
                    errorMessage: "Can't include @ in your username"
                }]
            }
        }
        if (options.userName.length <= 2) {
            return {
                errors: [{
                    fieldName: "userName",
                    errorMessage: "Your user name must greater then 2 character"
                }]
            }
        }
        if (options.passWord.length <= 3) {
            return {
                errors: [{
                    fieldName: "passWord",
                    errorMessage: "Your password must greater then 3 character"
                }]
            }
        }
        const hashPassWord = await argon2.hash(options.passWord)
        let user
        try {
            user = await User.create({ userName: options.userName, passWord: hashPassWord, email: options.email }).save();
        } catch (err) {
            if (err.detail.includes("@")) { // handle email error
                return {
                    errors: [{
                        fieldName: "email",
                        errorMessage: "The email already taken"
                    }]
                };
            }

            if (err.code == "23505") {// error for unique constraint
                return {
                    errors: [{
                        fieldName: "username",
                        errorMessage: "The user name already taken"
                    }]
                };
            }
        }
        req.session.userId = user?.id
        return { user }
    }
    @Mutation(() => UserRespond)
    async login(
        @Arg("userNameOrEmail") userNameOrEmail: string,
        @Arg("passWord") passWord: string,
        @Ctx() { req, }: MyConText
    ): Promise<UserRespond> {
        const user = await User.findOne(userNameOrEmail.includes("@") ? { where: { email: userNameOrEmail } }
            : { where: { userName: userNameOrEmail } })
        if (!user) {
            return {
                errors: [
                    {
                        fieldName: "userNameOrEmail",
                        errorMessage: "your user name or email doest exist or invalid"
                    }
                ]
            }
        }
        const unHashPassWord = await argon2.verify(user.passWord, passWord)
        if (!unHashPassWord) {
            return {
                errors: [
                    {
                        fieldName: "passWord",
                        errorMessage: "your passWord is not correct"
                    }
                ]
            }
        }
        req.session.userId = user.id
        return { user }
    }

    @Mutation(() => Boolean)
    async logout(
        @Ctx() { req, res }: MyConText
    ) {
        return new Promise((resolver) => {
            req.session.destroy(err => {
                res.clearCookie("qid");
                if (err) {
                    console.log(err)
                    resolver(false);
                    return
                }
                resolver(true)
            })
        })
    }
}