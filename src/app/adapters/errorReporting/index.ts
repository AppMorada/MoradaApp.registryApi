import { IReportError, ReportAdapter } from '../reports';
import { ErrorReporting } from '@google-cloud/error-reporting';

export class ErrorReportingHandler implements ReportAdapter {
	private readonly handler?: ErrorReporting;
	constructor() {
		if (process.env.ERROR_REPORTING_CLIENT)
			this.handler = new ErrorReporting({
				projectId: process.env.GCP_PROJECT,
				logLevel: 2,
				reportMode: 'production',
				credentials: JSON.parse(
					process.env.ERROR_REPORTING_CLIENT as string,
				),
				serviceContext: {
					service: process.env.SERVICE_NAME,
					version: process.env.SERVICE_VERSION,
				},
			});
	}

	error({ err, callback, ...rest }: IReportError) {
		if (this.handler)
			return this.handler.report(err, rest, undefined, callback);
		if (callback) callback();
	}
}
