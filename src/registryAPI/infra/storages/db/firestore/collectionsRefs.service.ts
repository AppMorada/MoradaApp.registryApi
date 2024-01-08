import { Injectable } from '@nestjs/common';
import { FirestoreService } from './firestore.service';

@Injectable()
export class CollectionsRefService {
	/**
	 * Prove as referencias das coleções e documentos do firestore
	 **/
	constructor(private readonly firestore: FirestoreService) {}

	public user = {
		core: this.firestore.instance.collection(
			'Entities/UsersDocuments/Core',
		),
		condominiumRelUser: (id: string) =>
			this.firestore.instance.collection(
				`Entities/UsersDocuments/Core/${id}/CondominiumRelUser`,
			),
		emailIndex: this.firestore.instance.collection('Index/Users/email'),
		cpfIndex: this.firestore.instance.collection('Index/Users/cpf'),
	};

	public condominium = {
		itself: this.firestore.instance.collection(
			'Entities/CondominiumsDocuments/Condominiums',
		),
		cnpj: this.firestore.instance.collection('Index/Condominiums/cnpj'),
		cep: this.firestore.instance.collection('Index/Condominiums/cep'),
	};

	public invite = {
		itself: this.firestore.instance.collection(
			'/Entities/UsersDocuments/Invites',
		),
		getInviteDoc: (id: string) => this.invite.itself.doc(id),
	};
}
