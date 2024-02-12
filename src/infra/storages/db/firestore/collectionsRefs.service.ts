import { Injectable } from '@nestjs/common';
import { FirestoreService } from './firestore.service';

@Injectable()
export class CollectionsRefService {
	/**
	 * Prove as referencias das coleções e documentos do firestore
	 **/
	constructor(private readonly firestore: FirestoreService) {}

	public signaturesCollection = this.firestore.instance.collection('secrets');
}
