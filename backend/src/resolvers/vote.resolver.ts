import { User } from "@prisma/client";
import { Arg, FieldResolver, Mutation, Resolver, Root } from "type-graphql";
import { GqlUser } from "../graphql/decorators/user.decorator.js";
import { IdeaModel } from "../models/idea.model.js";
import { UserModel } from "../models/user.model.js";
import { VoteModel } from "../models/vote.model.js";
import { IdeaService } from "../services/idea.service.js";
import { UserService } from "../services/user.service.js";
import { VoteService } from "../services/vote.service.js";

@Resolver(() => VoteModel)
export class VoteResolver {
  private voteService = new VoteService()
  private ideaService = new IdeaService()
  private userService = new UserService()

  @Mutation(() => Boolean)
  async toggleVote(
    @Arg('ideaId', () => String) ideaId: string,
    @GqlUser() user: User
  ): Promise<boolean> {
    return await this.voteService.toggleVote(user.id, ideaId)
  }

  @FieldResolver(() => IdeaModel)
  async idea(@Root() vote: VoteModel): Promise<IdeaModel> {
    return await this.ideaService.findIdeaById(vote.ideaId);
  }

  @FieldResolver(() => UserModel)
  async user(@Root() vote: VoteModel): Promise<UserModel> {
    return await this.userService.findUser(vote.userId);
  }
}
