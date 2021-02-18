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

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Deck, deck => deck.user, { cascade: true})
    decks: Deck[];

    @OneToMany(() => Folder, folder => folder.user, { cascade: true})
    folders: Folder[];

    @ManyToMany(() => Language, (language: Language) => language.users,{ cascade: true })
    @JoinTable({name: "userLanguages"})
    userLanguages: Language[]
}