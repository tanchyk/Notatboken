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

@Entity()
export class Deck extends BaseEntity {
    @PrimaryGeneratedColumn()
    deckId: number;

    @Column({length: 40})
    deckName!: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, user => user.decks, {onDelete: 'CASCADE'})
    user: User;

    @ManyToOne(() => Folder, folder => folder.decks, { nullable: true, onDelete: 'SET NULL'})
    folder: Folder | null;

    @ManyToOne(() => Language)
    language: Language;

    @OneToMany(() => Card,card => card.deck, { cascade: true})
    cards: Card[];
}