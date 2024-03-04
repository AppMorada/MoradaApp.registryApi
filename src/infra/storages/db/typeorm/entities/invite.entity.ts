import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	Relation,
	Unique,
} from 'typeorm';
import { TypeOrmCondominiumEntity } from './condominium.entity';

@Unique(['recipient', 'condominium'])
@Unique(['CPF', 'condominium'])
@Entity({ name: 'invites' })
export class TypeOrmInviteEntity {
	@PrimaryGeneratedColumn('uuid')
		id: string;

	@ManyToOne(
		() => TypeOrmCondominiumEntity,
		(condominium) => condominium.invite,
		{
			nullable: false,
			onDelete: 'CASCADE',
		},
	)
	@JoinColumn({
		name: 'condominium_id',
		referencedColumnName: 'id',
	})
		condominium: Relation<TypeOrmCondominiumEntity> | string;

	@Column({ length: 320, type: 'varchar' })
		recipient: string;

	@Column({ type: 'bigint', name: 'cpf' })
		CPF: string;

	@Column({ type: 'smallint', default: 0 })
		hierarchy: number;

	@CreateDateColumn({ name: 'created_at' })
		createdAt: Date;
}
