import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	Relation,
	UpdateDateColumn,
} from 'typeorm';
import { TypeOrmCondominiumRelUserEntity } from './condominiumRelUser.entity';

@Entity({ name: 'users' })
export class TypeOrmUserEntity {
	@PrimaryGeneratedColumn('uuid')
		id: string;

	@Column({ length: 120, type: 'varchar', unique: true })
		name: string;

	@Column({ length: 320, type: 'varchar', unique: true })
		email: string;

	@Column({ length: 64, type: 'varchar' })
		password: string;

	@Column({ length: 11, type: 'char', unique: true, name: 'cpf' })
		CPF: string;

	@Column({ length: 30, type: 'varchar', name: 'phone_number' })
		phoneNumber: string;

	@OneToMany(
		() => TypeOrmCondominiumRelUserEntity,
		(typeOrmCondominiumRelUserEntity) =>
			typeOrmCondominiumRelUserEntity.user,
	)
		condominiumRelUser: Relation<TypeOrmCondominiumRelUserEntity[]>;

	@CreateDateColumn({ name: 'created_at' })
		createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
		updatedAt: Date;
}
