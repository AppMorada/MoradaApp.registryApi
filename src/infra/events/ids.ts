export namespace EventsTypes {
	export namespace Email {
		export interface ISendProps {
			to: string;
			subject: string;
			body: string;
		}
	}
}

export const EVENT_ID = {
	EMAIL: {
		SEND: Symbol.for('email.send'),
	},
};
