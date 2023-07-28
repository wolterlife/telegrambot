import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
@Entity()
class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    text: string;

    @Column('text')
    dateAndTime: string;

    @Column('integer', {nullable: false})
    owner: number;

    @Column('boolean')
    isAlert: boolean;

    @Column('text')
    alertTime: string;
}

export default Task