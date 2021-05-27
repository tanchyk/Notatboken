import { Arg, Query, Resolver, UseMiddleware } from "type-graphql";
import { isAuth } from "../middleware/isAuth";

const Reverso = require("reverso-api");

@Resolver()
export class ContextHelperResolver {
  @Query()
  @UseMiddleware(isAuth)
  async searchContext(
    @Arg("languageName") languageName: string,
    @Arg("foreignWord") foreignWord: string
  ) {
    const reverso = new Reverso();

    const response = await reverso.getTranslation(
      foreignWord,
      languageName,
      "English"
    );

    if (response.context.examples === "no context examples") {
      return { message: "Sorry, we can't seem to find context for you 😔" };
    }

    return response.context.examples;
  }
}
