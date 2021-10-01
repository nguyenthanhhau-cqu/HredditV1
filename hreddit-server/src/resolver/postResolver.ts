import { Post } from "../entities/Post";
import {
  Arg,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { MyConText } from "src/types";
import { isAuth } from "../middleware/isAuth";
import { getConnection } from "typeorm";

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<Post[]> {
    const realLimit = Math.min(50, limit); // set the limit only 50  to avoid pull out entire database

    const qb = getConnection()
      .getRepository(Post)
      .createQueryBuilder("p")
      .orderBy(`"createdAt"`, "DESC")
      .take(realLimit);
    if (cursor) {
      qb.where(`"createdAt" < :cursor`, { cursor: new Date(parseInt(cursor)) }); //Compare createAt with createdAt of cursor
    }

    return qb.getMany();
  }

  @Query(() => Post, { nullable: true })
  async post(@Arg("id", () => Int) id: number): Promise<Post | undefined> {
    return await Post.findOne(id);
  }

  @Mutation(() => Boolean, { nullable: true })
  async deletePost(@Arg("id") id: number): Promise<boolean | null> {
    await Post.delete(id);
    return true;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title", () => String, { nullable: true }) title: string
  ): Promise<Post | null> {
    const post = await Post.findOne({ where: { id } });
    if (!post) {
      return null;
    }
    if (typeof title !== "undefined") {
      await Post.update({ id }, { title });
    }
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async createPost(
    @Arg("title", () => String, { nullable: true }) title: string,
    @Arg("text", () => String, { nullable: true }) text: string,
    @Ctx() { req }: MyConText
  ): Promise<Post> {
    return Post.create({ title, text, creatorId: req.session.userId }).save();
  }
}
