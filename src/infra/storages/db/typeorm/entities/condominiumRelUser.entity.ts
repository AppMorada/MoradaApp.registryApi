import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	Relation,
	Unique,
	UpdateDateColumn,
} from 'typeorm';
import { TypeOrmCondominiumEntity } from './condominium.entity';
import { TypeOrmUserEntity } from './user.entity';

@Unique(['user', 'condominium'])
@Entity({ name: 'condominiumreluser' })
export class TypeOrmCondominiumRelUserEntity {
	@PrimaryGeneratedColumn('uuid')
		id: string;

	@Column({ length: 6, type: 'varchar', nullable: true })
		block: string | null;

	@Column({ type: 'int', nullable: true, name: 'apartment_number' })
		apartmentNumber: number | null;

	@Column({ type: 'smallint', default: 0 })
		level: number;

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

	@ManyToOne(() => TypeOrmUserEntity, (user) => user.condominiumRelUser, {
		nullable: false,
		onDelete: 'CASCADE',
	})
	@JoinColumn({
		name: 'user_id',
		referencedColumnName: 'id',
	})
		user: Relation<TypeOrmUserEntity> | string;

	@UpdateDateColumn({ name: 'updated_at' })
		updatedAt: Date;
}
