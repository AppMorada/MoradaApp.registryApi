import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	Relation,
	Unique,
} from 'typeorm';
import { TypeOrmCondominiumEntity } from './condominium.entity';

@Unique(['email', 'condominium'])
@Entity({ name: 'invites' })
export class TypeOrmInviteEntity {
	@PrimaryGeneratedColumn('uuid')
		id: string;

	@Column({ length: 320, type: 'varchar' })
		email: string;

	@Column({ type: 'int' })
		ttl: number;

	@Column({ name: 'expires_at' })
		expiresAt: Date;

	@Column({ type: 'smallint', default: 0 })
		type: number;

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
}
