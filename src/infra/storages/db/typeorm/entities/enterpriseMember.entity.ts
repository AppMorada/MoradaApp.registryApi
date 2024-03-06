import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
	Relation,
	Unique,
	UpdateDateColumn,
} from 'typeorm';
import { TypeOrmCondominiumEntity } from './condominium.entity';
import { TypeOrmUserEntity } from './user.entity';

@Unique(['user', 'condominium'])
@Unique(['CPF', 'condominium'])
@Entity({ name: 'enterprise_members' })
export class TypeOrmEnterpriseMemberEntity {
	@PrimaryGeneratedColumn('uuid')
		id: string;

	@OneToOne(() => TypeOrmUserEntity, (user) => user.enterpriseMember, {
		nullable: false,
		onDelete: 'CASCADE',
	})
	@JoinColumn({
		name: 'user_id',
		referencedColumnName: 'id',
	})
		user: Relation<TypeOrmUserEntity> | string | null;

	@ManyToOne(
		() => TypeOrmCondominiumEntity,
		(condominium) => condominium.enterpriseMember,
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

	@Column({ type: 'bigint', name: 'cpf' })
		CPF: string;

	@CreateDateColumn({ name: 'created_at' })
		createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
		updatedAt: Date;
}
