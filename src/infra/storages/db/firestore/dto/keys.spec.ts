import { FirestoreCustomError } from '../error';
import { firestoreKeyDTO } from './keys.DTO';

describe('Firestore Key DTO test', () => {
	it('should be able to validate a content returned from firestore', () => {
		const body = {
			actual_Content: 'a'.repeat(200),
			actual_BuildedAt: Date.now(),
			ttl: 1,
			renewTime: 1,
		};

		expect(firestoreKeyDTO(body)).toBeTruthy();
	});

	it('should throw one error - content doesn\' exists', () => {
		expect(() => firestoreKeyDTO(undefined)).toThrow(FirestoreCustomError);
	});

	it('should throw one error - name does not match', () => {
		const body1 = {
			name: 'a',
			actual_Content: 'a'.repeat(200),
			actual_BuildedAt: Date.now(),
			ttl: 1,
			renewTime: 1,
		};

		const body2 = {
			name: 'a'.repeat(256),
			actual_Content: 'a'.repeat(200),
			actual_BuildedAt: Date.now(),
			ttl: 1,
			renewTime: 1,
		};

		const body3 = {
			name: undefined,
			actual_Content: 'a'.repeat(200),
			actual_BuildedAt: Date.now(),
			ttl: 1,
			renewTime: 1,
		};

		expect(() => firestoreKeyDTO(body1)).toThrow(FirestoreCustomError);
		expect(() => firestoreKeyDTO(body2)).toThrow(FirestoreCustomError);
		expect(() => firestoreKeyDTO(body3)).toThrow(FirestoreCustomError);
	});

	it('should throw one error - renewTime does not match', () => {
		const body1 = {
			name: 'na',
			actual_Content: 'a'.repeat(200),
			actual_BuildedAt: Date.now(),
			ttl: 1,
			renewTime: 0,
		};

		const body2 = {
			name: 'na',
			actual_Content: 'a'.repeat(200),
			actual_BuildedAt: Date.now(),
			ttl: 1,
			renewTime: undefined,
		};

		expect(() => firestoreKeyDTO(body1)).toThrow(FirestoreCustomError);
		expect(() => firestoreKeyDTO(body2)).toThrow(FirestoreCustomError);
	});

	it('should throw one error - ttl does not match', () => {
		const body1 = {
			name: 'na',
			actual_Content: 'a'.repeat(200),
			actual_BuildedAt: Date.now(),
			ttl: 0,
			renewTime: 1,
		};

		const body2 = {
			name: 'na',
			actual_Content: 'a'.repeat(200),
			actual_BuildedAt: Date.now(),
			ttl: undefined,
			renewTime: 1,
		};

		expect(() => firestoreKeyDTO(body1)).toThrow(FirestoreCustomError);
		expect(() => firestoreKeyDTO(body2)).toThrow(FirestoreCustomError);
	});

	it('should throw one error - actualBuildedAt does not match', () => {
		const body = {
			name: 'na',
			actual_Content: 'a'.repeat(200),
			actual_BuildedAt: undefined,
			ttl: 1,
			renewTime: 1,
		};

		expect(() => firestoreKeyDTO(body)).toThrow(FirestoreCustomError);
	});

	it('should throw one error - actualContent does not match', () => {
		const body1 = {
			name: 'na',
			actual_Content: undefined,
			actual_BuildedAt: Date.now(),
			ttl: 1,
			renewTime: 1,
		};

		const body2 = {
			name: 'na',
			actual_Content: 'a'.repeat(454),
			actual_BuildedAt: Date.now(),
			ttl: 1,
			renewTime: 1,
		};

		expect(() => firestoreKeyDTO(body1)).toThrow(FirestoreCustomError);
		expect(() => firestoreKeyDTO(body2)).toThrow(FirestoreCustomError);
	});

	it('should throw one error - actualBuildedAt does not match', () => {
		const body = {
			name: 'na',
			actual_Content: 'a'.repeat(200),
			actual_BuildedAt: undefined,
			ttl: 1,
			renewTime: 1,
		};

		expect(() => firestoreKeyDTO(body)).toThrow(FirestoreCustomError);
	});
});
