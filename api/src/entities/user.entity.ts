import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, DeleteDateColumn, CreateDateColumn } from 'typeorm';

export enum GENDER_ENUM {
  MALE = "male",
  FEMALE = "female"
}

export enum STATUS_ENUM {
  PENDING = "pending",
  ACTIVE = "active",
  DEACTIVE = "deactive"
}

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', select: false })
  password: string;

  @Column({ type: 'enum', enum: GENDER_ENUM })
  gender: GENDER_ENUM;

  @Column({ type: 'varchar' })
  phone: string;

  @Column({ type: 'enum', enum: STATUS_ENUM, default: STATUS_ENUM.PENDING })
  status: STATUS_ENUM;

  @Column({ type: 'varchar', name: 'profile_pic' })
  profilePic: string;

  @Column({ type: 'date' })
  date: Date;

  @DeleteDateColumn({ nullable:true })
  deletedAt: Date;
}
