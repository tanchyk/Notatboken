import {Arg, Ctx, Mutation, Resolver, UseMiddleware} from "type-graphql";
import {AddLanguageResponse, MyContext} from "../utils/types/types";
import { isAuth } from "../middleware/isAuth";
import { Language } from "../entities/Language";
import { getRepository } from "typeorm";
import { User } from "../entities/User";

@Resolver()
export class LanguageResolver {
    private languageRepository = getRepository(Language);
    private userRepository = getRepository(User);

    @Mutation(() => AddLanguageResponse)
    @UseMiddleware(isAuth)
    async addLanguage(
        @Arg("language") language: string,
        @Ctx() {req}: MyContext
    ): Promise<AddLanguageResponse> {
        //Finding user
        let user: User
        try {
            user = await this.userRepository.findOneOrFail({ relations: ["userLanguages"], where: {id: req.session.userId}});
        } catch (err) {
            return {
                errors: [{
                    field: "language",
                    message: "User not found"
                }],
                languageId: 0
            }
        }

        if(user.userLanguages.length >= 3) {
            return {
                errors: [{
                    field: "language",
                    message: "Sorry, Notatboken cant add more languages for you"
                }],
                languageId: 0
            }
        }

        //Finding language
        let languageUser: Language
        try {
            languageUser = await this.languageRepository.findOneOrFail({where: {languageName: language}});
        } catch (err) {
            return {
                errors: [{
                    field: "language",
                    message: "Sorry, Notatboken cant add this language for you yet"
                }],
                languageId: 0
            }
        }

        //Checking picked language
        if(user.userLanguages.some((language) => language.languageId === languageUser.languageId)) {
            return {
                errors: [{
                    field: "language",
                    message: "You already have this language"
                }],
                languageId: 0
            }
        }

        //Saving to a user
        user.userLanguages.push(languageUser);
        await this.userRepository.save(user);

        return {
            errors: null,
            languageId: languageUser.languageId
        }
    }
}