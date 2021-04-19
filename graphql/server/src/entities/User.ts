import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    OneToMany, JoinTable, ManyToMany
} from "typeorm";
import {Language} from "./Language";
import {Deck} from "./Deck";
import {Folder} from "./Folder";
import {DayChecked} from "./DayChecked";
import {CardChecked} from "./CardChecked";
import {Field, ObjectType} from "type-graphql";

@ObjectType()
@Entity()
@Unique(["username", "email"])
export class User extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id: number;

    @Field({nullable: true})
    @Column({nullable: true})
    name: string;

    @Field()
    @Column({unique: true, length: 64})
    username!: string;

    @Column({length: 100})
    password!: string;

    @Field()
    @Column({unique: true, length: 320})
    email!: string;

    @Field()
    @Column({default: false})
    confirmed: boolean;

    @Field()
    @Column({default: 5})
    userGoal: number;

    @Field()
    @Column({default: "https://res.cloudinary.com/dw3hb6ec8/image/upload/v1614456522/app/default_avatar_jubcnt.png"})
    avatar: string;

    @Field()
    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Deck, deck => deck.user, { cascade: true})
    decks: Deck[];

    @OneToMany(() => DayChecked, dayChecked => dayChecked.user, { cascade: true})
    daysChecked: DayChecked[];

    @OneToMany(() => CardChecked, cardChecked => cardChecked.user, { cascade: true})
    cardsChecked: CardChecked[];

    @OneToMany(() => Folder, folder => folder.user, { cascade: true})
    folders: Folder[];

    @ManyToMany(() => Language, (language: Language) => language.users,{ cascade: true })
    @JoinTable({name: "userLanguages"})
    userLanguages: Language[];
}