import {BaseEntity, CreateDateColumn, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {User} from "./User";
import {Field, ObjectType} from "type-graphql";

@ObjectType()
@Entity()
export class DayChecked extends BaseEntity {
    @Field()
    @CreateDateColumn()
    @PrimaryColumn({default: new Date()})
    createdAt: Date;

    @ManyToOne(() => User, user => user.daysChecked, {primary: true, onDelete: 'CASCADE'})
    user: User;
}