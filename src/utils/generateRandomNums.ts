export function generateRandomNums(limit = 7): string {
	const code: string[] = [];

	for (let i = 0; i < limit; i++) {
		const number = Math.floor(Math.random() * 10);
		const letter = number.toString(10);
		code.push(letter);
	}

	return code.join(',').replaceAll(',', '').toLocaleUpperCase();
}
