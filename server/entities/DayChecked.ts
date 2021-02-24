import {BaseEntity, CreateDateColumn, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {User} from "./User";

@Entity()
export class DayChecked extends BaseEntity {
    @CreateDateColumn()
    @PrimaryColumn()
    createdAt: Date;

    @ManyToOne(() => User, user => user.daysChecked, {primary: true, onDelete: 'CASCADE'})
    user: User;
}