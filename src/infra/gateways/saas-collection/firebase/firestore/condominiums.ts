// import { CondominiumMapper } from '@app/mapper/condominium';
// import {
// 	CondominiumRepo,
// 	ICondominiumSearchQuery,
// 	ICreateCondominiumInput,
// } from '@app/repositories/condominium';
// import { FirebaseInstances } from '..';
// import { Filter } from 'firebase-admin/firestore';
// import { Condominium } from '@app/entities/condominium';
//
// export class CondominiumsFirestore implements CondominiumRepo {
// 	async create(input: ICreateCondominiumInput): Promise<void> {
// 		const condInObjt = CondominiumMapper.toObject(input.condominium);
// 		await FirebaseInstances.firestore
// 			.collection('condominiums')
// 			.add(condInObjt);
// 	}
// 	async find(
// 		input: ICondominiumSearchQuery,
// 	): Promise<Condominium | undefined> {
// 		const condominium = await FirebaseInstances.firestore
// 			.collection('condominiums')
// 			.where(
// 				Filter.or(
// 					Filter.where('id', '==', String(input.id)),
// 					Filter.where('CEP', '==', String(input.CEP?.value)),
// 					Filter.where('CNPJ', '==', String(input.CNPJ?.value)),
// 					Filter.where('name', '==', String(input.name?.value)),
// 				),
// 			)
// 			.get();
//
// 		console.log(condominium);
//
// 		return undefined;
// 	}
// }
