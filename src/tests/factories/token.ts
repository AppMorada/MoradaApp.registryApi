import { createHmac } from 'crypto';

interface ICreateSignatureSectionProps {
	signature: string;
	body: any;
	header: {
		alg: 'HS256';
		typ: 'JWT';
	};
}

interface ITokenFactoryProps {
	body: any;
	signature: string;
}

function createSignatureSection(input: ICreateSignatureSectionProps) {
	const hmac = createHmac('sha256', input.signature);
	const payload = JSON.stringify({
		header: input.header,
		body: input.body,
	});

	hmac.update(payload);

	const hash = hmac.digest('hex');
	return hash;
}

export function tokenFactory(input: ITokenFactoryProps) {
	const header = {
		alg: 'HS256',
		typ: 'JWT',
	} as const;

	const toBase64 = (input: string) =>
		encodeURIComponent(btoa(input).replaceAll('=', ''));

	const sigSection = toBase64(createSignatureSection({ header, ...input }));
	const payloadSection = toBase64(JSON.stringify(input.body));
	const headerSection = toBase64(JSON.stringify(header));

	const token = `${headerSection}.${payloadSection}.${sigSection}`;
	return token;
}
