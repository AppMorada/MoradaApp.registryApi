import { Injectable } from '@nestjs/common';
import { FirestoreService } from '../firestore.service';
import {
	InviteRepo,
	InviteRepoInterfaces,
} from '@registry:app/repositories/invite';
import { InviteFirestoreMapper } from '../mapper/invite';
import { InviteMapper } from '@registry:app/mapper/invite';
import { Invite } from '@registry:app/entities/invite';
import { DatabaseCustomError, DatabaseCustomErrorsTags } from '../../error';
import { UserMapper } from '@registry:app/mapper/user';
import { Index } from '../entities/indexes';
import { FirestoreGetInviteDTO } from '../DTO/getInvite';
import { CondominiumRelUserMapper } from '@registry:app/mapper/condominiumRelUser';
import { CollectionsRefService } from '../collectionsRefs.service';

@Injectable()
export class InviteFirestore implements InviteRepo {
	constructor(
		private readonly collectionsRefs: CollectionsRefService,
		private readonly firestore: FirestoreService,
	) {}

	async create(input: InviteRepoInterfaces.create): Promise<void> {
		const { id, ...invite } = InviteMapper.toObject(input.invite);
		const database = this.firestore.instance;

		await database.runTransaction(async (transaction) => {
			let userId: string | undefined;
			const getUserQuery = this.collectionsRefs.user.core
				.where('email', '==', invite.email)
				.limit(1);

			await transaction.get(getUserQuery).then((res) => {
				if (res.empty) return;

				res.forEach((item) => {
					if (item.exists) userId = item.id;
				});
			});

			if (userId) {
				const condominiumRelUserQuery = this.collectionsRefs.user
					.condominiumRelUser(userId)
					.count();
				let condominiumLinkedWithThisUser = 0;

				await transaction.get(condominiumRelUserQuery).then((res) => {
					condominiumLinkedWithThisUser = res.data().count;
				});

				if (condominiumLinkedWithThisUser >= 1)
					throw new DatabaseCustomError({
						message: 'Este usuário já esta em um condomínio',
						tag: DatabaseCustomErrorsTags.maximumCondominiumRelUser,
					});
			}

			const existentNumberOfInvites =
				await this.collectionsRefs.invite.itself
					.where('email', '==', invite.email)
					.where('condominiumId', '==', invite.condominiumId)
					.count()
					.get();

			if (existentNumberOfInvites.data().count > 0)
				throw new DatabaseCustomError({
					message: 'Usuário já foi convidado',
					tag: DatabaseCustomErrorsTags.contentAlreadyExists,
				});

			const inviteRef = this.collectionsRefs.invite.getInviteDoc(id);
			transaction.create(inviteRef, invite);
		});
	}

	async delete(input: InviteRepoInterfaces.remove): Promise<void> {
		await this.collectionsRefs.invite
			.getInviteDoc(input.key.value)
			.delete();
	}

	async transferToUserResources(
		input: InviteRepoInterfaces.transferToUserResources,
	): Promise<void> {
		const { id: userId, ...user } = UserMapper.toObject(input.user);

		/* eslint-disable @typescript-eslint/no-unused-vars */
		const {
			id: __,
			userId: _,
			condominiumId,
			...condominiumRelUser
		} = CondominiumRelUserMapper.toObject(input.condominiumRelUser);

		const database = this.firestore.instance;

		let inviteId: undefined | string;
		await this.collectionsRefs.invite.itself
			.where('email', '==', user.email)
			.where('condominiumId', '==', condominiumId)
			.limit(1)
			.get()
			.then((res) =>
				res.forEach((item) => {
					if (item.exists) inviteId = item.id;
				}),
			);

		if (!inviteId)
			throw new DatabaseCustomError({
				message: 'Convite não existe',
				tag: DatabaseCustomErrorsTags.contentDoesntExists,
			});

		const refs = {
			invite: this.collectionsRefs.invite.getInviteDoc(inviteId),
			email: this.collectionsRefs.user.emailIndex.doc(user.email),
			cpf: this.collectionsRefs.user.cpfIndex.doc(user.CPF),
			core: this.collectionsRefs.user.core.doc(userId),
			condominiumRelUser: this.collectionsRefs.user
				.condominiumRelUser(userId)
				.doc(condominiumId),
		};

		const batch = database.batch();
		batch.delete(refs.invite, { exists: true });

		const contentOfIndexThatPointsToUser = new Index({
			ref: refs.core,
		}).flat();
		batch.create(refs.cpf, contentOfIndexThatPointsToUser);
		batch.create(refs.email, contentOfIndexThatPointsToUser);

		batch.create(refs.core, user);
		batch.create(refs.condominiumRelUser, condominiumRelUser);

		await batch.commit();
	}

	async find(input: InviteRepoInterfaces.safelyFind): Promise<Invite>;
	async find(input: InviteRepoInterfaces.find): Promise<Invite | undefined>;

	async find(
		input: InviteRepoInterfaces.find | InviteRepoInterfaces.safelyFind,
	): Promise<Invite | undefined> {
		const query = this.collectionsRefs.invite.itself
			.where('email', '==', input.key.value)
			.limit(1);
		const queryResult = await query.get();

		let unparsedInvite: Record<string, any> | undefined;

		queryResult.forEach((doc) => {
			unparsedInvite = { id: doc.id, ...doc.data() };
			return;
		});

		if (!unparsedInvite && input?.safeSearch)
			throw new DatabaseCustomError({
				message: 'Este usuário não existe',
				tag: DatabaseCustomErrorsTags.safeSearchEnabled,
			});

		if (!unparsedInvite) return undefined;

		const semiparsedInvite = FirestoreGetInviteDTO.exec(unparsedInvite);
		const parsedInvite =
			InviteFirestoreMapper.fromFirestoreToClass(semiparsedInvite);
		return parsedInvite;
	}
}
