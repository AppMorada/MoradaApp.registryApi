import { UUID } from '@app/entities/VO';
import {
	ICondominiumRequestEntityPropsInput,
	CondominiumRequest,
} from '@app/entities/condominiumRequest';

type TOverride = Partial<ICondominiumRequestEntityPropsInput>;
export function condominiumRequestFactory(input: TOverride = {}) {
	return new CondominiumRequest({
		userId: UUID.genV4().value,
		condominiumId: UUID.genV4().value,
		...input,
	});
}
