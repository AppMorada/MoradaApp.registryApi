import { CondominiumMapper } from '@registry:app/mapper/condominium';
import {
	CondominiumInterfaces,
	CondominiumRepo,
} from '@registry:app/repositories/condominium';
import { FirestoreService } from '../firestore.service';
import { Condominium } from '@registry:app/entities/condominium';
import { Injectable } from '@nestjs/common';
import { Index } from '../entities/indexes';
import { CollectionsRefService } from '../collectionsRefs.service';

@Injectable()
export class CondominiumsFirestore implements CondominiumRepo {
	constructor(
		private readonly collectionsRefs: CollectionsRefService,
		private readonly firestore: FirestoreService,
	) {}

	async create(input: CondominiumInterfaces.create): Promise<void> {
		const { id, ...condominium } = CondominiumMapper.toObject(
			input.condominium,
		);

		const database = this.firestore.instance;
		const batch = database.batch();

		const refs = {
			cnpjIndex: this.collectionsRefs.condominium.cnpj.doc(
				condominium.CNPJ,
			),
			cepIndex: this.collectionsRefs.condominium.cep.doc(condominium.CEP),
		};

		const condominiumIndexRef = new Index({
			ref: this.collectionsRefs.condominium.itself.doc(id),
		}).flat();

		batch.create(refs.cnpjIndex, condominiumIndexRef);
		batch.create(refs.cepIndex, condominiumIndexRef);

		const entityRef = this.collectionsRefs.condominium.itself.doc(id);
		batch.create(entityRef, condominium);

		await batch.commit();
	}

	async find(input: CondominiumInterfaces.safeSearch): Promise<Condominium>;
	async find(
		input: CondominiumInterfaces.search,
	): Promise<Condominium | undefined>;

	async find(): Promise<Condominium | undefined> {
		throw new Error(
			'"find" Method not implemented in "CondominiumsFirestore"',
		);
	}
}
