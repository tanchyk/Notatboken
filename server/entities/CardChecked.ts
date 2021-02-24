import {BaseEntity, CreateDateColumn, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {User} from "./User";
import {Card} from "./Card";

@Entity()
export class CardChecked extends BaseEntity {
    @CreateDateColumn()
    @PrimaryColumn({default: new Date()})
    createdAt: Date;

    @ManyToOne(() => Card, card => card.cardsChecked, {primary: true, onDelete: 'CASCADE'})
    card: Card;

    @ManyToOne(() => User, user => user.cardsChecked, {onDelete: 'CASCADE'})
    user: User;
}