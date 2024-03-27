import {
	BatchSpanProcessor,
	SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { Resource } from '@opentelemetry/resources';
import {
	SEMRESATTRS_SERVICE_NAME,
	SEMRESATTRS_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { TraceExporter } from '@google-cloud/opentelemetry-cloud-trace-exporter';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { Injectable } from '@nestjs/common';

export const TRACE_ID = '__TRACE_ID__';

@Injectable()
export class TraceHandler {
	private readonly exporter: TraceExporter | ZipkinExporter;
	private readonly spanProcessor: SimpleSpanProcessor | BatchSpanProcessor;
	private readonly tracer: NodeTracerProvider;

	constructor() {
		this.exporter =
			process.env.NODE_ENV !== 'production'
				? new ZipkinExporter({
					serviceName: process.env.SERVICE_NAME,
					url: process.env.ZIPKIN_TRACE_URL,
				})
				: new TraceExporter({
					projectId: process.env.LOGGING_PROJECT,
					credentials: JSON.parse(
							process.env.OBSERVER_AGENT as string,
					),
				});

		this.spanProcessor =
			process.env.NODE_ENV !== 'production'
				? new SimpleSpanProcessor(this.exporter)
				: new BatchSpanProcessor(this.exporter);

		this.tracer = new NodeTracerProvider({
			resource: new Resource({
				[SEMRESATTRS_SERVICE_NAME]: process.env.SERVICE_NAME,
				[SEMRESATTRS_SERVICE_VERSION]: process.env.SERVICE_VERSION,
			}),
		});
		this.tracer.addSpanProcessor(this.spanProcessor);

		process.on('SIGTERM', async () => {
			await this.tracer.shutdown();
		});
	}

	getTracer(name: string) {
		return this.tracer.getTracer(name);
	}

	start() {
		this.tracer.register();
		registerInstrumentations({
			instrumentations: [
				new HttpInstrumentation(),
				new ExpressInstrumentation(),
				new NestInstrumentation(),
			],
		});
	}
}

export const trace = new TraceHandler();
