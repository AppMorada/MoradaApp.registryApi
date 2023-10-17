export interface ICryptCompare {
	data: string;
	hashedData: string;
}

export abstract class CryptAdapter {
	abstract hash(data: string): Promise<string>;
	abstract compare(input: ICryptCompare): Promise<boolean>;
}
