import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Deck} from "./Deck";

export type ProficiencyType = 'fail' | 'repeat' | '1d' | '3d' | '7d' | '21d' | '31d' | '90d' | 'learned'

@Entity()
export class Card extends BaseEntity {
    @PrimaryGeneratedColumn()
    cardId: number;

    @Column({length: 50})
    foreignWord!: string;

    @Column({length: 50})
    nativeWord!: string;

    @Column({nullable: true})
    imageId: number;

    @Column({nullable: true})
    voiceId: number;

    @Column({nullable: true, length: 120})
    foreignContext: string;

    @Column({nullable: true, length: 120})
    nativeContext: string;

    @Column({nullable: true, default: new Date()})
    reviewDate: Date;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Deck, deck => deck.cards, { onDelete: 'CASCADE' })
    deck: Deck;
}