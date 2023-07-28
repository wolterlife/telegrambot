import {
  Entity, PrimaryGeneratedColumn, Column,
} from 'typeorm';

@Entity()
class Weather {
  @PrimaryGeneratedColumn()
    id: number;

  @Column('text')
    city: string;

  @Column('bigint')
    subTime: number;

  @Column('integer', { nullable: false })
    owner: number;
}

export default Weather;
