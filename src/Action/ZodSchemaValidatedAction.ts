import { type ZodSchema, type infer as Infer, ZodObject } from 'zod';
import { type TypeResponse } from '../Type/Response';
import { type ActionInterface } from '../Interface/ActionInterface';
import { EnumErrorCode } from '../Type/ErrorCode';

export class ZodSchemaValidatedAction<TypePayloadSchema extends ZodSchema, TypeObjectSchema extends ZodSchema>
implements ActionInterface<Infer<TypePayloadSchema>, Infer<TypeObjectSchema>>
{
	/**
	 * Constructor.
	 *
	 * @param {TypePayloadSchema} payloadSchema - The Zod schema for the input data
	 * @param {TypeObjectSchema} objectSchema - The Zod schema for the output data
	 * @param {ActionInterface<Infer<TypePayloadSchema>, Infer<TypeObjectSchema>>} action - The action to wrap
	 */
	constructor(
		private readonly payloadSchema: TypePayloadSchema,
		private readonly objectSchema:TypeObjectSchema,
		private readonly action: ActionInterface<Infer<TypePayloadSchema>, Infer<TypeObjectSchema>>
	) {}

	/**
	 * Executes the action logic after validating the input payload and the response.
	 *
	 * @param {Infer<TypePayloadSchema>} payload - The input payload for the action
	 * @returns {Promise<TypeResponse<Infer<TypeObjectSchema>>>} - The result of the action wrapped in a TypeResponse
	 */
	public async execute(payload: Infer<TypePayloadSchema>): Promise<TypeResponse<Infer<TypeObjectSchema>>>
	{
		// Validate the input using the input schema
		const parsedPayload = this.payloadSchema.safeParse(payload);
		if (!parsedPayload.success)
		{
			return {
				success: false,
				messages: parsedPayload.error.errors.map((error) => ({code: EnumErrorCode.VALIDATION_ERROR, text: error.message}))
			};
		}

		// Execute the wrapped action
		const response = await this.action.execute(parsedPayload.data);

		const validatedResponse = (this.objectSchema as unknown as ZodObject<any>).strip().safeParse(response.data);

		// Re-assign validated output data
		response.data = validatedResponse.data;

		if (!validatedResponse.success)
		{
			return {
				success: false,
				messages: validatedResponse.error.errors.map((error) => ({code: EnumErrorCode.VALIDATION_ERROR, text: error.message}))
			};
		}

		return response;
	}
}
