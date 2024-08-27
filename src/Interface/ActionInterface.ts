import { type TypeResponse } from '../Type/Response';
import { type ServiceInterface } from './ServiceInterface';

/**
 * Action is a specialized service primarily to implement integrations with external services that do network calls.
 */
export interface ActionInterface<TypePayload, TypeObject> extends ServiceInterface<TypePayload, TypeResponse<TypeObject>>
{
	/**
	 * Executes the action with the given input
	 *
	 * @param {TypePayload} payload - The input data for the action
	 * @returns {Promise<TypeResponse<TypeObject>>} - The result of the action wrapped in a TypeResponse
	 */
	execute(payload: TypePayload): Promise<TypeResponse<TypeObject>>;
}
