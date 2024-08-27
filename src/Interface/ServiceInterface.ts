/**
 * Service is a class that encapsulates re-usable business logic and provides a method to execute it with a given payload.
 */
export interface ServiceInterface<TypePayload, TypeResponse>
{
	/**
	 * Executes business logic of a service with a given payload and settings and returns a response
	 *
	 * @param {TypePayload} payload - The input data for the service
	 * @returns {Promise<TypeResponse>} - The result of the service
	 */
	execute(payload: TypePayload): Promise<TypeResponse>;
}
