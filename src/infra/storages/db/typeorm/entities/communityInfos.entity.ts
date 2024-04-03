import {
	Column,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryColumn,
	UpdateDateColumn,
} from 'typeorm';
import { TypeOrmCondominiumMemberEntity } from './condominiumMember.entity';

@Entity({ name: 'community_infos' })
export class TypeOrmCommunityInfosEntity {
	@PrimaryColumn({
		name: 'member_id',
		nullable: false,
		foreignKeyConstraintName: 'PK_community_infos_member_id',
	})
	@OneToOne(
		() => TypeOrmCondominiumMemberEntity,
		(member) => member.communityInfos,
		{
			nullable: false,
			onDelete: 'CASCADE',
		},
	)
	@JoinColumn({
		name: 'member_id',
		referencedColumnName: 'id',
		foreignKeyConstraintName: 'FK_community_infos_member_id',
	})
		member: string;

	@Column({ type: 'int', name: 'apartment_number', nullable: true })
		apartmentNumber: number | null;

	@Column({ length: 6, type: 'varchar', nullable: true })
		block: string | null;

	@UpdateDateColumn({ name: 'updated_at' })
		updatedAt: Date;
}
