import { Field, InputType } from "type-graphql";
import { Role } from "../../models/user.model";

@InputType() // This is a decorator from type-graphql that marks this class as a GraphQL input type. It allows us to define the shape of the data that will be sent to the server when performing mutations or queries that require input.
export class CreateUserInput {
  @Field(() => String) // This is a decorator from type-graphql that marks this property as a GraphQL field. It allows us to define the type of the field and how it will be represented in the GraphQL schema.
  name!: string;
  @Field(() => String) // This is a decorator from type-graphql that marks this property as a GraphQL field. It allows us to define the type of the field and how it will be represented in the GraphQL schema.
  email!: string;
}

@InputType()
export class UpdateUserInput {
  @Field(() => String, { nullable: true }) // This is a decorator from type-graphql that marks this property as a GraphQL field. It allows us to define the type of the field and how it will be represented in the GraphQL schema.
  name?: string;
  @Field(() => Role, { nullable: true }) // This is a decorator from type-graphql that marks this property as a GraphQL field. It allows us to define the type of the field and how it will be represented in the GraphQL schema.
  role?: Role;
}
