import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "./User";
import {Deck} from "./Deck";
import {Language} from "./Language";
import {Field, ObjectType} from "type-graphql";

@ObjectType()
@Entity()
export class Folder extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    folderId: number;

    @Field()
    @Column({length: 40})
    folderName!: string;

    @Field()
    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, user => user.folders, {onDelete: 'CASCADE'})
    user: User;

    @ManyToOne(() => Language)
    language: Language;

    @OneToMany(() => Deck, deck => deck.folder)
    decks: Deck[];
}