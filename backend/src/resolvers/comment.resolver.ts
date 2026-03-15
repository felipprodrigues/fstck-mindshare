import { User } from "@prisma/client";
import { Arg, FieldResolver, Mutation, Resolver, Root } from "type-graphql";
import { CreateCommentInput } from "../dtos/input/comment.input.js";
import { GqlUser } from "../graphql/decorators/user.decorator.js";
import { CommentModel } from "../models/comment.model.js";
import { IdeaModel } from "../models/idea.model.js";
import { UserModel } from "../models/user.model.js";
import { CommentService } from "../services/comment.service.js";
import { IdeaService } from "../services/idea.service.js";
import { UserService } from "../services/user.service.js";

@Resolver(() => CommentModel)
export class CommentResolver {
  private commentService = new CommentService()
  private ideaService = new IdeaService()
  private userService = new UserService()

  @Mutation(() => CommentModel)
  async createComment(
    @Arg('ideaId', () => String) ideaId: string,
    @Arg('data', () => CreateCommentInput) data: CreateCommentInput,
    @GqlUser() user: User
  ): Promise<CommentModel> {
    return this.commentService.create(ideaId, user.id, data);
  }

  @FieldResolver(() => IdeaModel)
    async idea(@Root() comment: CommentModel): Promise<IdeaModel> {
      return await this.ideaService.findIdeaById(comment.ideaId);
    }

  @FieldResolver(() => UserModel)
    async author(@Root() comment: CommentModel): Promise<UserModel> {
      return await this.userService.findUser(comment.authorId);
    }
}
