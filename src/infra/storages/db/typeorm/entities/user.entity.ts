import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	Relation,
	UpdateDateColumn,
} from 'typeorm';
import { TypeOrmCondominiumMemberEntity } from './condominiumMember.entity';
import { TypeOrmEnterpriseMemberEntity } from './enterpriseMember.entity';
import { TypeOrmCondominiumEntity } from './condominium.entity';

@Entity({ name: 'users' })
export class TypeOrmUserEntity {
	@PrimaryGeneratedColumn('uuid')
		id: string;

	@Column({ length: 120, type: 'varchar' })
		name: string;

	@Column({ length: 320, type: 'varchar', unique: true })
		email: string;

	@Column({ type: 'bigint', name: 'phone_number', nullable: true })
		phoneNumber: string | null;

	@Column({ type: 'bigint', name: 'cpf' })
		CPF: string;

	@Column({ length: 60, type: 'char' })
		password: string;

	@Column({ type: 'smallint', default: 0 })
		tfa: number;

	@OneToMany(() => TypeOrmCondominiumMemberEntity, (member) => member.user)
		condominiumMember: Relation<TypeOrmCondominiumMemberEntity>[];

	@OneToMany(() => TypeOrmEnterpriseMemberEntity, (member) => member.user)
		enterpriseMember: Relation<TypeOrmEnterpriseMemberEntity>[];

	@OneToOne(() => TypeOrmCondominiumEntity, (condominium) => condominium.user)
		condominium: Relation<TypeOrmCondominiumEntity>;

	@CreateDateColumn({ name: 'created_at' })
		createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
		updatedAt: Date;
}
