import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	Relation,
	UpdateDateColumn,
} from 'typeorm';
import { TypeOrmInviteEntity } from './invite.entity';
import { TypeOrmCondominiumRelUserEntity } from './condominiumRelUser.entity';

@Entity({ name: 'condominiums' })
export class TypeOrmCondominiumEntity {
	@PrimaryGeneratedColumn('uuid')
		id: string;

	@Column({ length: 120, type: 'varchar', unique: true })
		name: string;

	@Column({ length: 8, type: 'char', unique: true, name: 'cep' })
		CEP: string;

	@Column({ type: 'int' })
		num: number;

	@Column({ length: 14, type: 'char', unique: true, name: 'cnpj' })
		CNPJ: string;

	@CreateDateColumn({ name: 'created_at' })
		createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
		updatedAt: Date;

	@OneToMany(() => TypeOrmInviteEntity, (invite) => invite.condominium)
		invite: Relation<TypeOrmInviteEntity>[];

	@OneToMany(
		() => TypeOrmCondominiumRelUserEntity,
		(condominiumRelUser) => condominiumRelUser.condominium,
	)
		condominiumRelUser: Relation<TypeOrmCondominiumRelUserEntity>[];
}
