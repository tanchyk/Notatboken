import {Response, Request, NextFunction} from 'express';
import {getRepository} from "typeorm";
import {User} from "../entities/User";
import {Language} from "../entities/Language";

class LanguageController {
    static getLanguages = async (req: Request, res: Response, next: NextFunction) => {
        const userId = res.locals.userId;

        const userRepository = getRepository(User);
        let languages;
        try {
            languages = await userRepository.find({ relations: ["userLanguages"], where: {id: userId}});
        } catch (err) {
            return res.status(404).send({message: "User not found"});
        }

        return res.status(201).send({
            languages: languages[0].userLanguages
        });
    }

    static addLanguage = async (req: Request, res: Response, next: NextFunction) => {
        const userId = res.locals.userId;
        const {language} = req.body;

        //Finding user
        const userRepository = getRepository(User);
        let user: User
        try {
            user = await userRepository.findOneOrFail({ relations: ["userLanguages"], where: {id: userId}});
        } catch (err) {
            return res.status(404).send({message: "User not found"});
        }

        if(user.userLanguages.length >= 3) {
            return res.status(404).send({message: "Sorry, Notatboken cant add more languages for you"});
        }

        //Finding language
        const languageRepository = getRepository(Language);
        let languageUser: Language
        try {
            languageUser = await languageRepository.findOneOrFail({where: {languageName: language}});
        } catch (err) {
            return res.status(404).send({message: "Sorry, Notatboken cant use this language yet"});
        }

        //Checking picked language
        user.userLanguages.forEach((language): Response | void => {
            if(language.languageId === languageUser.languageId) {
                return res.status(409).send({message: 'You already have this language'});
            }
        })

        //Saving to a user
        user.userLanguages.push(languageUser);
        await userRepository.save(user);

        return res.status(200).send({message: 'Language is added'});
    }
}

export default LanguageController;