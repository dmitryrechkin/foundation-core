import { type ZodSchema, type infer as Infer, type SafeParseReturnType } from 'zod';
import { type ServiceInterface } from '../Interface/ServiceInterface';

export class ZodSchemaValidatedService<TypePayloadSchema extends ZodSchema, TypeResponseSchema extends ZodSchema>
implements ServiceInterface<Infer<TypePayloadSchema>, SafeParseReturnType<any, Infer<TypeResponseSchema>>>
{
	/**
	 * Constructor.
	 *
	 * @param {TypePayloadSchema} payloadSchema - The Zod schema for the input data
	 * @param {TypeResponseSchema} responseSchema - The Zod schema for the output data
	 * @param {ServiceInterface<Infer<TypePayloadSchema>, Infer<TypeResponseSchema>>} service - The service to wrap
	 */
	constructor(
		private readonly payloadSchema: TypePayloadSchema,
		private readonly responseSchema: TypeResponseSchema,
		private readonly service: ServiceInterface<Infer<TypePayloadSchema>, Infer<TypeResponseSchema>>
	) {}

	/**
	 * Executes the service logic after validating the input payload and the response.
	 *
	 * @param {Infer<TypePayloadSchema>} payload - The input payload for the service
	 * @returns {Promise<SafeParseReturnType<any, Infer<TypeResponseSchema>>>} - The Zod validation result for the response
	 */
	public async execute(payload: Infer<TypePayloadSchema>): Promise<SafeParseReturnType<any, Infer<TypeResponseSchema>>>
	{
		// Validate the payload using the input schema
		const parsedPayload = this.payloadSchema.safeParse(payload);
		if (!parsedPayload.success)
		{
			return parsedPayload;
		}

		// Execute the wrapped service with the validated payload
		const response = await this.service.execute(parsedPayload.data);

		// Validate the response using the response schema
		const parsedResponse = this.responseSchema.safeParse(response);

		return parsedResponse;
	}
}
