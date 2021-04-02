import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export interface IUser {
    id: number;
    name: string;
}

@Entity({
    name: 'users'
})
export class User implements IUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}
