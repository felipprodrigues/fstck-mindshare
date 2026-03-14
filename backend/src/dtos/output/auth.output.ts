import { Field, ObjectType } from "type-graphql";
import { UserModel } from "../../models/user.model.js"; // Update this path to match your actual file structure

@ObjectType() // This is a decorator from type-graphql that marks this class as a GraphQL input type. It allows us to define the shape of the data that will be sent to the server when performing mutations or queries that require input.
export class RegisterOutput {
  @Field(() => String) // This is a decorator from type-graphql that marks this property as a GraphQL field. It allows us to define the type of the field and how it will be represented in the GraphQL schema.
  token!: string;

  @Field(() => String)
  refreshToken!: string // This is a decorator from type-graphql that marks this property as a GraphQL field. It allows us to define the type of the field and how it will be represented in the GraphQL schema.

  @Field(() => UserModel)
  user!: UserModel
}

@ObjectType()
export class LoginOutput {
  @Field(() => String) // This is a decorator from type-graphql that marks this property as a GraphQL field. It allows us to define the type of the field and how it will be represented in the GraphQL schema.
  token!: string;

  @Field(() => String)
  refreshToken!: string // This is a decorator from type-graphql that marks this property as a GraphQL field. It allows us to define the type of the field and how it will be represented in the GraphQL schema.

  @Field(() => UserModel)
  user!: UserModel
}
