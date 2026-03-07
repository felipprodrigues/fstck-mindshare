import { Arg, Query, Resolver, UseMiddleware } from "type-graphql";
import { UserModel } from "../models/user.model";
import { UserService } from "../services/user.service";
import { isAuth } from "../middlewares/auth.middleware.js";

@Resolver(()=> UserModel)
@UseMiddleware(isAuth)
export class UserResolver {
  private userService = new UserService();

  @Query(() => UserModel)
  async getUser(
    @Arg('id', () => String) id: string
  ): Promise<UserModel> {
    return this.userService.findUser(id);
  }
}
