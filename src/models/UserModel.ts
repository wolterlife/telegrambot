import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity()
class User {
  @PrimaryGeneratedColumn()
    id: number;

  @Column('integer')
    chatId: number;

  @Column('text', { nullable: true })
    telegram: string | undefined;
}

export default User;
