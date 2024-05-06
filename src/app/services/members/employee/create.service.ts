import { CryptAdapter } from '@app/adapters/crypt';
import { CPF, Email, Password } from '@app/entities/VO';
import { User } from '@app/entities/user';
import { Injectable } from '@nestjs/common';
import { IService } from '../../_IService';
import { EmployeeMemberWriteOps } from '@app/repositories/employeeMember/write';
import { CondominiumMember } from '@app/entities/condominiumMember';

interface IProps {
	user: User;
	condominiumId: string;
	flatAndRawUniqueRegistry: {
		CPF: string;
		email: string;
	};
}

@Injectable()
export class CreateEmployeeUserService implements IService {
	constructor(
		private readonly crypt: CryptAdapter,
		private readonly enterpriseMemberRepoCreate: EmployeeMemberWriteOps.Create,
	) {}

	async exec({ user, condominiumId, flatAndRawUniqueRegistry }: IProps) {
		const hashPass = await this.crypt.hash(user.password.value);

		const userCopy = user.dereference();
		userCopy.password = new Password(hashPass);

		const member = new CondominiumMember({
			condominiumId,
			userId: user.id.value,
			role: 1,
		});

		await this.enterpriseMemberRepoCreate.exec({
			member,
			user: userCopy,
			rawUniqueRegistry: {
				CPF: new CPF(flatAndRawUniqueRegistry.CPF),
				email: new Email(flatAndRawUniqueRegistry.email),
			},
		});
	}
}
