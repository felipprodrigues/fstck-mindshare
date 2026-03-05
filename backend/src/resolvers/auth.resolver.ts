import { Arg, Mutation, Resolver } from "type-graphql";
import { RegisterInput } from "../dtos/input/auth.input";
import { RegisterOutput } from "../dtos/output/auth.output";
import { AuthService } from "../services/auth.service";

@Resolver() //This is a decorator from type-graphql that marks this class as a GraphQL resolver. It allows us to define methods that will handle GraphQL queries and mutations.
export class AuthResolver {
  private authService: AuthService = new AuthService();

  @Mutation(() => RegisterOutput) // returns the mutation response
  async register(
    @Arg('data', () => RegisterInput) data: RegisterInput
  ): Promise<RegisterOutput> {
    return this.authService.register(data);
  }
}
