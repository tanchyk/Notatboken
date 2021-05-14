import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "./User";
import {Language} from "./Language";
import {Card} from "./Card";
import {Folder} from "./Folder";
import {Field, ObjectType} from "type-graphql";

@ObjectType()
@Entity()
export class Deck extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    deckId: number;

    @Field()
    @Column({length: 40})
    deckName!: string;

    @Field()
    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @Field(() => User)
    @ManyToOne(() => User, user => user.decks, {onDelete: 'CASCADE'})
    user: User;

    @Field(() => Folder)
    @ManyToOne(() => Folder, folder => folder.decks, {nullable: true, onDelete: 'SET NULL'})
    folder: Folder | null;

    @Field(() => Language)
    @ManyToOne(() => Language)
    language: Language;

    @Field(() => [Card])
    @OneToMany(() => Card, card => card.deck, {cascade: true})
    cards: Card[];
}