import {BaseEntity, CreateDateColumn, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {User} from "./User";
import {Card} from "./Card";
import {Field, ObjectType} from "type-graphql";

@ObjectType()
@Entity()
export class CardChecked extends BaseEntity {
    @Field()
    @CreateDateColumn()
    @PrimaryColumn({default: new Date()})
    createdAt: Date;

    @ManyToOne(() => Card, card => card.cardsChecked, {primary: true, onDelete: 'CASCADE'})
    card: Card;

    @ManyToOne(() => User, user => user.cardsChecked, {onDelete: 'CASCADE'})
    user: User;
}