import { Field, GraphQLISODateTime, ID, ObjectType, registerEnumType } from "type-graphql";

export enum Role {
  owner = 'owner',
  admin = 'admin',
  member = 'member',
  viewer = 'viewer',
}

registerEnumType(Role, {
  name: 'Role',
  description: 'User role in the system',
})

@ObjectType() // This is a decorator from type-graphql that marks this class as a GraphQL object type. It allows us to define the shape of the data that will be returned from the server when performing queries or mutations that return this type.
export class UserModel {
  @Field(() => ID)
  id!: string; // This is a decorator from type-graphql that marks this property as a GraphQL field. It allows us to define the type of the field and how it will be represented in the GraphQL schema.

  @Field(() => String) // This is a decorator from type-graphql that marks this property as a GraphQL field. It allows us to define the type of the field and how it will be represented in the GraphQL schema.
  name!: string;

  @Field(() => String) // This is a decorator from type-graphql that marks this property as a GraphQL field. It allows us to define the type of the field and how it will be represented in the GraphQL schema.
  email!: string;

  @Field(() => String, { nullable: true }) // This is a decorator from type-graphql that marks this property as a GraphQL field. It allows us to define the type of the field and how it will be represented in the GraphQL schema.
  password?: string | null;

  @Field(() => Role, { nullable: true })
  role?: string

  @Field(() => GraphQLISODateTime) // This is a decorator from type-graphql that marks this property as a GraphQL field. It allows us to define the type of the field and how it will be represented in the GraphQL schema.
  createdAt!: Date;

  @Field(() => GraphQLISODateTime) // This is a decorator from type-graphql that marks this property as a GraphQL field. It allows us to define the type of the field and how it will be represented in the GraphQL schema.
  updatedAt!: Date;
}
