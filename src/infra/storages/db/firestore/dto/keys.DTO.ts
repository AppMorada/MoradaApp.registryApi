import { z } from 'zod';
import { FirestoreCustomError, FirestoreCustomErrorTag } from '../error';

export function firestoreKeyDTO(
	body: any,
	callbackErr?: (err: FirestoreCustomError) => void,
) {
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
		const parsedErr = new FirestoreCustomError({
			message: 'Malformed internal entitiy',
			tag: FirestoreCustomErrorTag.malformedEntity,
			cause: err.message,
		});

		if (!callbackErr) throw parsedErr;
		return callbackErr(parsedErr);
	}
}
