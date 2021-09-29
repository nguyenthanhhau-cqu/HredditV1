import { Post } from "../entities/Post";
import { Arg, Ctx, Int, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { MyConText } from "src/types";
import { isAuth } from "../middleware/isAuth";

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    posts(): Promise<Post[]> {
        return Post.find()
    }

    @Query(() => Post, { nullable: true })
    async post(
        @Arg('id', () => Int) id: number,
    ): Promise<Post | undefined> {
        return await Post.findOne(id)
    }


    @Mutation(() => Boolean, { nullable: true })
    async deletePost(
        @Arg('id') id: number,
    ): Promise<boolean | null> {
        await Post.delete(id);
        return true;
    }

    @Mutation(() => Post, { nullable: true })
    async updatePost(
        @Arg('id') id: number,
        @Arg('title', () => String, { nullable: true }) title: string,
    ): Promise<Post | null> {
        const post = await Post.findOne({ where: { id } })
        if (!post) {
            return null
        }
        if (typeof title !== "undefined") {
            await Post.update({ id }, { title })
        }
        return post
    }

    @Mutation(() => Post, { nullable: true })
    @UseMiddleware(isAuth)
    async createPost(
        @Arg('title', () => String, { nullable: true }) title: string,
        @Arg('text', () => String, { nullable: true }) text: string,
        @Ctx() { req }: MyConText
    ): Promise<Post> {


        return Post.create({ title, text, creatorId: req.session.userId }).save();
    }
}