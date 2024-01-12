import { UserRepo, UserRepoInterfaces } from '@registry:app/repositories/user';
import { FirestoreService } from '../firestore.service';
import { User } from '@registry:app/entities/user';
import { DatabaseCustomError, DatabaseCustomErrorsTags } from '../../error';
import { UserFirestoreMapper } from '../mapper/users';
import { Injectable } from '@nestjs/common';
import { FirestoreGetUserDTO } from '../DTO/getUser';
import { UUID, CPF, Email } from '@registry:app/entities/VO';
import { CollectionReference } from 'firebase-admin/firestore';
import { CondominiumRelUser } from '@registry:app/entities/condominiumRelUser';
import { FirestoreGetCondominiumRelUserDTO } from '../DTO/getCondominiumRel';
import { CondominiumRelUserFirestoreMapper } from '../mapper/condominiumRelUser';
import { CollectionsRefService } from '../collectionsRefs.service';
import { TCondominiumRelUserToObject } from '@registry:app/mapper/condominiumRelUser';

@Injectable()
export class UsersFirestore implements UserRepo {
	constructor(
		private readonly collectionsRefs: CollectionsRefService,
		private readonly firestore: FirestoreService,
	) {}

	async create(): Promise<void> {
		throw new DatabaseCustomError({
			message: 'Esta funcionalidade ainda não foi desenvolvida',
			tag: DatabaseCustomErrorsTags.contentDoesntExists,
		});
	}

	private async searchByField(
		collection: CollectionReference,
		field: string,
		input: string | number,
	) {
		let data: Record<string, any> | undefined;
		const res = await collection.where(field, '==', input).limit(1).get();

		if (!res.empty)
			res.forEach((item) => {
				if (item.exists) data = { id: item.id, ...item.data() };
			});

		return data;
	}

	private async searchById(input: string) {
		let data: Record<string, any> | undefined;
		const res = await this.collectionsRefs.user.core.doc(input).get();
		if (res.exists) data = { id: res.id, ...res.data() };

		return data;
	}

	async find(input: UserRepoInterfaces.safeSearch): Promise<User>;
	async find(input: UserRepoInterfaces.search): Promise<User | undefined>;

	async find(
		input: UserRepoInterfaces.search | UserRepoInterfaces.safeSearch,
	): Promise<User | undefined> {
		const queries = [
			{
				exec: async () => await this.searchById(input.key.value),
				trigger: input.key instanceof UUID,
			},
			{
				exec: async () =>
					await this.searchByField(
						this.collectionsRefs.user.core,
						'email',
						input.key.value,
					),
				trigger: input.key instanceof Email,
			},
			{
				exec: async () =>
					await this.searchByField(
						this.collectionsRefs.user.core,
						'cpf',
						input.key.value,
					),
				trigger: input.key instanceof CPF,
			},
		];

		let unparsedUser: Record<string, any> | undefined;
		for await (const query of queries) {
			if (!query.trigger) continue;
			unparsedUser = await query.exec();
			break;
		}

		if (!unparsedUser && input?.safeSearch)
			throw new DatabaseCustomError({
				message: 'Este usuário não existe',
				tag: DatabaseCustomErrorsTags.safeSearchEnabled,
			});

		if (!unparsedUser) return undefined;

		const parsedUser = FirestoreGetUserDTO.exec(unparsedUser);
		return UserFirestoreMapper.fromFirebaseToClass(parsedUser);
	}

	async getCondominiumRelation(
		input: UserRepoInterfaces.getCondominiumRelation,
	): Promise<CondominiumRelUser | undefined> {
		const snapshot = await this.collectionsRefs.user
			.condominiumRelUser(input.userId.value)
			.doc(input.condominiumId.value)
			.get();
		if (!snapshot.exists) return undefined;

		const unparsedData = {
			id: snapshot.id,
			userId: input.userId.value,
			condominiumId: snapshot.id,
			...snapshot.data(),
		};
		const semiparsedData =
			FirestoreGetCondominiumRelUserDTO.exec(unparsedData);
		const parsedData =
			CondominiumRelUserFirestoreMapper.fromFirestoreToClass(
				semiparsedData,
			);

		return parsedData;
	}

	async getAllCondominiumRelation(
		input: UserRepoInterfaces.getAllCondominiumRelation,
	): Promise<TCondominiumRelUserToObject[]> {
		const snapshot = await this.collectionsRefs.user
			.condominiumRelUser(input.userId.value)
			.get();
		if (snapshot.empty) return [];

		const condominiumRelUserArr: TCondominiumRelUserToObject[] = [];
		snapshot.forEach((item) => {
			if (!item.exists) return;
			const unparsedData = {
				id: item.id,
				userId: input.userId.value,
				condominiumId: item.id,
				...item.data(),
			};
			const semiparsedData =
				FirestoreGetCondominiumRelUserDTO.exec(unparsedData);
			const parsedData =
				CondominiumRelUserFirestoreMapper.fromFirestoreToObject(
					semiparsedData,
				);

			condominiumRelUserArr.push(parsedData);
		});

		return condominiumRelUserArr;
	}

	async delete(input: UserRepoInterfaces.remove): Promise<void> {
		const database = this.firestore.instance;

		const queries = [
			{
				exec: async () => await this.searchById(input.key.value),
				trigger: input.key instanceof UUID,
			},
			{
				exec: async () =>
					await this.searchByField(
						this.collectionsRefs.user.core,
						'email',
						input.key.value,
					),
				trigger: input.key instanceof Email,
			},
		];

		for await (const query of queries) {
			if (!query.trigger) continue;

			const unparsedUser: Record<string, any> | undefined =
				await query.exec();

			if (unparsedUser) {
				const semiparsedUser = FirestoreGetUserDTO.exec(unparsedUser);
				const parsedUser =
					UserFirestoreMapper.fromFirebaseToObject(semiparsedUser);

				await database.runTransaction(async (transaction) => {
					const refs = {
						condominiumRelUserCollection:
							this.collectionsRefs.user.condominiumRelUser(
								parsedUser.id,
							),
						core: this.collectionsRefs.user.core.doc(parsedUser.id),
						emailIndex: this.collectionsRefs.user.emailIndex.doc(
							parsedUser.email,
						),
						cpfIndex: this.collectionsRefs.user.cpfIndex.doc(
							parsedUser.CPF,
						),
					};

					await refs.condominiumRelUserCollection
						.get()
						.then((res) => {
							res.forEach((item) => {
								if (item.exists) {
									const condominiumRelUser =
										this.collectionsRefs.user
											.condominiumRelUser(parsedUser.id)
											.doc(item.id);
									transaction.delete(condominiumRelUser, {
										exists: true,
									});
								}
							});
						});

					transaction.delete(refs.core, { exists: true });
					transaction.delete(refs.emailIndex, { exists: true });
					transaction.delete(refs.cpfIndex, { exists: true });
				});

				break;
			}

			throw new DatabaseCustomError({
				message: 'Usuário não existe',
				tag: DatabaseCustomErrorsTags.contentDoesntExists,
			});
		}
	}
}
