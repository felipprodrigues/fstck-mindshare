import { Field, InputType } from "type-graphql";

@InputType() // This is a decorator from type-graphql that marks this class as a GraphQL input type. It allows us to define the shape of the data that will be sent to the server when performing mutations or queries that require input.
export class CreateIdeaInput {
  @Field(() => String) // This is a decorator from type-graphql that marks this property as a GraphQL field. It allows us to define the type of the field and how it will be represented in the GraphQL schema.
  title!: string;

  @Field(() => String, { nullable: true }) // This is a decorator from type-graphql that marks this property as a GraphQL field. It allows us to define the type of the field and how it will be represented in the GraphQL schema.
  description?: string;
}

@InputType()
export class UpdateIdeaInput {
  @Field(() => String, { nullable: true }) // This is a decorator from type-graphql that marks this property as a GraphQL field. It allows us to define the type of the field and how it will be represented in the GraphQL schema.
  title?: string;

  @Field(() => String, { nullable: true }) // This is a decorator from type-graphql that marks this property as a GraphQL field. It allows us to define the type of the field and how it will be represented in the GraphQL schema.
  description?: string | null | undefined;
}
