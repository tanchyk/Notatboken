import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity, ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {User} from "./User";
import {Field, ObjectType} from "type-graphql";

@ObjectType()
@Entity()
export class Language extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    languageId: number;

    @Field()
    @Column({unique: true, length: 40})
    languageName: string;

    @Field()
    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToMany(() => User, (user: User) => user.userLanguages, {onDelete: 'CASCADE'})
    users: User[];
}