import { ExecutionContext } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

export const createMockExecutionContext = (request: any): ExecutionContext => {
	const httpArgumentHost = {
		getRequest: () => request,
	} as HttpArgumentsHost;

	return {
		getHandler: function () {
			return this;
		},
		switchToHttp: () => httpArgumentHost,
	} as ExecutionContext;
};
