import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Deck} from "./Deck";
import {CardChecked} from "./CardChecked";

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

    @Column({nullable: true, length: 220})
    foreignContext: string;

    @Column({nullable: true, length: 220})
    nativeContext: string;

    @Column({
        type: "enum",
        enum: ['fail', 'repeat', '1d', '3d', '7d', '21d', '31d', '90d', 'learned'],
        default: 'fail'
    })
    proficiency: ProficiencyType

    @Column({nullable: true})
    reviewDate: Date;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Deck, deck => deck.cards, { onDelete: 'CASCADE' })
    deck: Deck;

    @OneToMany(() => CardChecked, cardChecked => cardChecked.card, { cascade: true})
    cardsChecked: CardChecked[];
}