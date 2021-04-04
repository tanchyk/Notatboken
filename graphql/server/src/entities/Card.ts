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
import {Field, ObjectType} from "type-graphql";

export type ProficiencyType = 'fail' | 'repeat' | '1d' | '3d' | '7d' | '21d' | '31d' | '90d' | 'learned'

@ObjectType()
@Entity()
export class Card extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    cardId: number;

    @Field()
    @Column({length: 50})
    foreignWord!: string;

    @Field()
    @Column({length: 50})
    nativeWord!: string;

    @Field({nullable: true})
    @Column({nullable: true})
    imageId: number;

    @Field({nullable: true})
    @Column({nullable: true})
    voiceId: number;

    @Field({nullable: true})
    @Column({nullable: true, length: 220})
    foreignContext: string;

    @Field({nullable: true})
    @Column({nullable: true, length: 220})
    nativeContext: string;

    @Field()
    @Column({
        type: "enum",
        enum: ['fail', 'repeat', '1d', '3d', '7d', '21d', '31d', '90d', 'learned'],
        default: 'fail'
    })
    proficiency: ProficiencyType

    @Field({nullable: true})
    @Column({nullable: true})
    reviewDate: Date;

    @Field()
    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Deck, deck => deck.cards, { onDelete: 'CASCADE' })
    deck: Deck;

    @OneToMany(() => CardChecked, cardChecked => cardChecked.card, { cascade: true})
    cardsChecked: CardChecked[];
}