import {Arg, Ctx, Mutation, Resolver, UseMiddleware} from "type-graphql";
import {ConfirmationResponse, MyContext} from "../types/types";
import { isAuth } from "src/middleware/isAuth";
import { Language } from "src/entities/Language";
import { getRepository } from "typeorm";
import { User } from "src/entities/User";

@Resolver()
export class LanguageResolver {
    @Mutation(() => ConfirmationResponse)
    @UseMiddleware(isAuth)
    async addLanguage(
        @Arg("language") language: Language,
        @Ctx() {req}: MyContext
    ): Promise<ConfirmationResponse> {
        //Finding user
        const userRepository = getRepository(User);
        let user: User
        try {
            user = await userRepository.findOneOrFail({ relations: ["userLanguages"], where: {id: req.session.userId}});
        } catch (err) {
            return {
                errors: [{
                    field: "language",
                    message: "User not found"
                }],
                confirmed: false
            }
        }

        if(user.userLanguages.length >= 3) {
            return {
                errors: [{
                    field: "language",
                    message: "Sorry, Notatboken cant add more languages for you"
                }],
                confirmed: false
            }
        }

        //Finding language
        const languageRepository = getRepository(Language);
        let languageUser: Language
        try {
            languageUser = await languageRepository.findOneOrFail({where: {languageName: language}});
        } catch (err) {
            return {
                errors: [{
                    field: "language",
                    message: "Sorry, Notatboken cant use this language yet"
                }],
                confirmed: false
            }
        }

        //Checking picked language
        user.userLanguages.forEach((language): ConfirmationResponse | void => {
            if(language.languageId === languageUser.languageId) {
                return {
                    errors: [{
                        field: "language",
                        message: "You already have this language"
                    }],
                    confirmed: false
                }
            }
        })

        //Saving to a user
        user.userLanguages.push(languageUser);
        await userRepository.save(user);

        return {
            errors: null,
            confirmed: true
        }
    }
}