import {
	Column,
	Entity,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	Relation,
	Unique,
} from 'typeorm';
import { TypeOrmUserEntity } from './user.entity';
import { TypeOrmCondominiumMemberEntity } from './condominiumMember.entity';

@Unique('UQ_unique_registries_email', ['email'])
@Entity({ name: 'unique_registries' })
export class TypeOrmUniqueRegistryEntity {
	@PrimaryGeneratedColumn('uuid', {
		primaryKeyConstraintName: 'PK_unique_registry_id',
	})
		id: string;

	@Column({ name: 'cpf', type: 'bigint', nullable: true })
		CPF: string | null;

	@Column({ type: 'varchar', length: 320 })
		email: string;

	@OneToOne(() => TypeOrmUserEntity, (user) => user.uniqueRegistry)
		user: Relation<TypeOrmUserEntity>;

	@OneToMany(
		() => TypeOrmCondominiumMemberEntity,
		(member) => member.uniqueRegistry,
	)
		member: Relation<TypeOrmCondominiumMemberEntity>;
}
