export interface ICryptCompare {
	data: string;
	hashedData: string;
}

export interface ICryptHmac {
	data: string;
	key: string;
}

export abstract class CryptAdapter {
	abstract hash(data: string): Promise<string>;
	abstract hashWithHmac(input: ICryptHmac): Promise<string>;
	abstract compare(input: ICryptCompare): Promise<boolean>;
}
