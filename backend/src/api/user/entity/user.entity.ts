import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: null })
    firstName: string;

    @Column({ default: null })
    lastName: string;

    @Column({ default: null })
    email: string;

    @Column({ default: null })
    password: string;

    @Column({ default: null })
    dateOfBirth: Date;

    @Column({ default: null })
    createdAt: Date;

    @Column({ default: null })
    updatedAt: Date;
}