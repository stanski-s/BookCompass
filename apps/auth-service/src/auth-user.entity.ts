import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Entity()
export class AuthUser {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password_hash!: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role!: Role;

  @Column({ nullable: true })
  refresh_token_hash!: string;
}
