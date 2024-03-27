import { trace } from '@infra/configs/tracing';
import { RegistryAPIBootstrap } from './bootstrap';

const app = new RegistryAPIBootstrap(trace);
app.start();
