import { z } from 'zod';
import { FirestoreCustomError, FirestoreCustomErrorTag } from '../error';
import { LayersEnum, LoggerAdapter } from '@app/adapters/logger';

export function firestoreKeyDTO(body: any, logger?: LoggerAdapter) {
	const schema = z
		.object({
			prev_Content: z.string().length(200).or(z.undefined()),
			prev_BuildedAt: z.number().or(z.undefined()),
			actual_Content: z.string().length(200),
			actual_BuildedAt: z.number(),
			ttl: z.number().min(1),
			renewTime: z.number().min(1),
		})
		.strict();

	try {
		const output = schema.parse(body);
		return output;
	} catch (err) {
		logger?.fatal({
			name: err.name,
			description: err.message,
			layer: LayersEnum.database,
		});

		throw new FirestoreCustomError({
			message: 'Malformed internal entitiy',
			tag: FirestoreCustomErrorTag.malformedEntity,
			cause: err.message,
		});
	}
}
