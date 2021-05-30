import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { AddLanguageResponse, MyContext } from "../utils/types/types";
import { isAuth } from "../middleware/isAuth";
import { LanguageService } from "../services/LanguageService";

@Resolver()
export class LanguageResolver {
  constructor(private readonly languageService: LanguageService) {}

  @Mutation(() => AddLanguageResponse)
  @UseMiddleware(isAuth)
  addLanguage(
    @Arg("language") language: string,
    @Ctx() { req }: MyContext
  ): Promise<AddLanguageResponse> {
    return this.languageService.addLanuageToUser(req.session.userId, language);
  }
}
