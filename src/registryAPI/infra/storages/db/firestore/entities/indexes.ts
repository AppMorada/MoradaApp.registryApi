import { DocumentData, DocumentReference } from 'firebase-admin/firestore';
import { DatabaseCustomError, DatabaseCustomErrorsTags } from '../../error';

export interface IIndexProps {
	ref: DocumentReference<DocumentData>;
}

export class Index {
	private readonly props: IIndexProps;

	/**
	 *	Usado para manipular e validar a integridade dos índices no firestore
	 **/
	constructor(input: IIndexProps) {
		if (!(input.ref instanceof DocumentReference))
			throw new DatabaseCustomError({
				message: 'Malformed reference',
				tag: DatabaseCustomErrorsTags.malformedRef,
			});

		this.props = { ...input };
	}

	get ref(): DocumentReference<DocumentData> {
		return this.props.ref;
	}

	/**
	 * Converte o índice em um objeto
	 **/
	flat(): IIndexProps {
		return { ref: this.ref };
	}
}
