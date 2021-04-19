import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity, ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "./User";

@Entity()
export class Language extends BaseEntity {
    @PrimaryGeneratedColumn()
    languageId: number;

    @Column({unique: true, length: 40})
    languageName: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToMany(() => User, (user: User) => user.userLanguages, {onDelete: 'CASCADE'})
    users: User[];
}