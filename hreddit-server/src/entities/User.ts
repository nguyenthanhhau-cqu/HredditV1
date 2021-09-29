import { Field, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, OneToMany } from "typeorm";
import { Post } from "./Post";


@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number; // string is also supported 

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date

    @OneToMany(() => Post, post => post.creator)
    posts: Post[];

    @Field()
    @Column({ unique: true })
    userName!: string;

    @Field()
    @Column({ unique: true })
    email!: string;

    @Column()
    passWord!: string;

}