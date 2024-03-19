export interface IReportError {
	err: Error;
	url: string;
	method: string;
	statusCode: number;
	userAgent: string | undefined;
}

export abstract class ReportAdapter {
	abstract error(input: IReportError): void;
}
