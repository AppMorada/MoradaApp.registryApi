import { KeysEnum } from '@app/repositories/key';
import { GetKeyService } from '@app/services/getKey.service';

export async function mapInviteKeyBasedOnLevel(
	input: number | undefined,
	getKey: GetKeyService,
): Promise<string> {
	switch (input) {
	case 1:
		return (
			await getKey.exec({ name: KeysEnum.INVITE_ADMIN_TOKEN_KEY })
		).key.actual.content;
	case 2:
		return (
			await getKey.exec({
				name: KeysEnum.INVITE_SUPER_ADMIN_TOKEN_KEY,
			})
		).key.actual.content;
	default:
		return (await getKey.exec({ name: KeysEnum.INVITE_TOKEN_KEY })).key
			.actual.content;
	}
}
