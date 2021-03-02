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

@Entity()
@Unique(["username", "email"])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    name: string;

    @Column({unique: true, length: 64})
    username!: string;

    @Column({length: 100})
    password!: string;

    @Column({unique: true, length: 320})
    email!: string;

    @Column({default: false})
    confirmed: boolean;

    @Column({default: 5})
    userGoal: number;

    @Column({default: "https://res.cloudinary.com/dw3hb6ec8/image/upload/v1614722799/notatboken/workplace_crsauv.png"})
    avatar: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

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