export function mapInviteKeyBasedOnLevel(input: number | undefined): string {
	switch (input) {
	case 1:
		return process.env.INVITE_ADMIN_TOKEN_KEY as string;
	case 2:
		return process.env.INVITE_SUPER_ADMIN_TOKEN_KEY as string;
	default:
		return process.env.INVITE_TOKEN_KEY as string;
	}
}
