import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    OneToMany
} from "typeorm";
import { Length } from "class-validator";
import {Note} from "./Note";

@Entity()
@Unique(["username", "email"])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(4, 20)
    username!: string;

    @Column()
    @Length(4, 100)
    password!: string;

    @Column()
    email!: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Note, note => note.user)
    notes: Note[];
}