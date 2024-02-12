type TServiceExecReturn = Promise<Record<string, any>> | Promise<void> | void;
type TServiceExecInput = Record<string, any>;

/** Usado para garantir uma padronização nos services, obrigando por exemplo, o a existência de funções com retorno de objetos ou void **/
export abstract class IService {
	abstract exec(input?: TServiceExecInput): TServiceExecReturn;
}
