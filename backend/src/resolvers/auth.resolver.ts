import { Arg, Mutation, Resolver } from "type-graphql";
import { LoginInput, RegisterInput } from "../dtos/input/auth.input.js";
import { LoginOutput, RegisterOutput } from "../dtos/output/auth.output.js";
import { AuthService } from "../services/auth.service.js";

@Resolver() //This is a decorator from type-graphql that marks this class as a GraphQL resolver. It allows us to define methods that will handle GraphQL queries and mutations.
export class AuthResolver {
  private authService: AuthService = new AuthService();

  @Mutation(() => LoginOutput) // returns the mutation response
  async login(
    @Arg('data', () => LoginInput) data: LoginInput
  ): Promise<LoginOutput> {
    return this.authService.login(data);
  }


  @Mutation(() => RegisterOutput) // returns the mutation response
  async register(
    @Arg('data', () => RegisterInput) data: RegisterInput
  ): Promise<RegisterOutput> {
    return this.authService.register(data);
  }
}
