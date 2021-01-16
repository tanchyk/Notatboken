import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {Length} from "class-validator";
import {User} from "./User";

@Entity()
export class Note extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(1, 40)
    title!: string;

    @Column({nullable: true})
    @Length(1, 400)
    body: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, user => user.notes)
    user: User;
}