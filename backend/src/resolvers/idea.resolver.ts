import { User } from "@prisma/client";
import { Arg, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { CreateIdeaInput, UpdateIdeaInput } from "../dtos/input/idea.input.js";
import { GqlUser } from "../graphql/decorators/user.decorator.js";
import { isAuth } from "../middlewares/auth.middleware.js";
import { IdeaModel } from "../models/idea.model.js";
import { UserModel } from "../models/user.model.js";
import { IdeaService } from "../services/idea.service.js";
import { UserService } from "../services/user.service.js";

@Resolver(() => IdeaModel)
@UseMiddleware(isAuth)
export class IdeaResolver {
  private ideaService = new IdeaService()
  private userService = new UserService()

  @Mutation(() => IdeaModel)
  async createIdea(
    @Arg('data', () => CreateIdeaInput) data: CreateIdeaInput,
    @GqlUser() user: User | null
  ): Promise<IdeaModel> {
    if (!user) throw new Error("Unauthorized");
    return this.ideaService.createIdea(data, user.id);
  }

  @Mutation(() => IdeaModel)
  async updateIdea(
    @Arg('id', () => String) id: string,
    @Arg('data', () => UpdateIdeaInput) data: UpdateIdeaInput,
  ): Promise<IdeaModel> {
    return this.ideaService.updateIdea(id, data);
  }

  @Query(() => [IdeaModel])
  async listIdeas(): Promise<IdeaModel[]> {
    return this.ideaService.listIdeas();
  }

  @Mutation(() => Boolean)
  async deleteIdea(
    @Arg('id', () => String) id: string
  ): Promise<boolean> {
    return this.ideaService.deleteIdea(id)
  }

  @FieldResolver(() => UserModel)
  async author(@Root() idea: IdeaModel): Promise<UserModel> {
    return await this.userService.findUser(idea.authorId);
  }
}
