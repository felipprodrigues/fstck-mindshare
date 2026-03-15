import { Field, ID, ObjectType } from "type-graphql";
import { IdeaModel } from "./idea.model.js";
import { UserModel } from "./user.model.js";

@ObjectType() // This is a decorator from type-graphql that marks this class as a GraphQL object type. It allows us to define the shape of the data that will be returned from the server when performing queries or mutations that return this type.
export class VoteModel {
  @Field(() => ID)
  id!: string; // This is a decorator from type-graphql that marks this property as a GraphQL field. It allows us to define the type of the field and how it will be represented in the GraphQL schema.

  @Field(() => String) // This is a decorator from type-graphql that marks this property as a GraphQL field. It allows us to define the type of the field and how it will be represented in the GraphQL schema.
  userId!: string;

  @Field(() => String)
  ideaId!: string;

  @Field(() => UserModel, { nullable: true }) // This is a decorator from type-graphql that marks this property as a GraphQL field. It allows us to define the type of the field and how it will be represented in the GraphQL schema.
  user?: UserModel;

  @Field(() => IdeaModel, { nullable: true })
  idea?: IdeaModel;
}

