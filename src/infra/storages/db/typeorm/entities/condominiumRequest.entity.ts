import {
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryColumn,
} from 'typeorm';
import { TypeOrmCondominiumEntity } from './condominium.entity';
import { TypeOrmUserEntity } from './user.entity';

@Entity({ name: 'condominium_requests' })
export class TypeOrmCondominiumRequestEntity {
	@PrimaryColumn({
		nullable: false,
		primaryKeyConstraintName:
			'PK_condominium_requests_user_id_and_condominium_id',
		type: 'uuid',
	})
	@OneToOne(() => TypeOrmUserEntity, (user) => user.condominiumRequest, {
		nullable: false,
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	@JoinColumn({
		name: 'user_id',
		referencedColumnName: 'id',
		foreignKeyConstraintName: 'FK_condominium_requests_user_id',
	})
		user: TypeOrmUserEntity | string;

	@PrimaryColumn({
		nullable: false,
		primaryKeyConstraintName:
			'PK_condominium_requests_user_id_and_condominium_id',
		type: 'uuid',
	})
	@OneToOne(
		() => TypeOrmCondominiumEntity,
		(condominium) => condominium.condominiumRequest,
		{
			nullable: false,
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE',
		},
	)
	@JoinColumn({
		name: 'condominium_id',
		referencedColumnName: 'id',
		foreignKeyConstraintName: 'FK_condominium_requests_condominium_id',
	})
		condominium: TypeOrmCondominiumEntity | string;

	@CreateDateColumn({ name: 'created_at' })
		createdAt: Date;
}
