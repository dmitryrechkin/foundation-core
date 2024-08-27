import { ZodSchema } from 'zod';

/**
 * Tool is specialized class meant to be used in the context of AI to perform a specific task.
 */
export interface ToolInterface<TypePayload, TypeResponse>
{
	/**
	 * The name of the tool.
	 */
	readonly name: string;

	/**
	 * The description of the tool.
	 */
	readonly description: string;

	/**
	 * The schema for the payload data.
	 */
	readonly parameters: ZodSchema<TypePayload>;

	/**
	 * Executes the tool with the given input payload.
	 *
	 * @param {TypePayload} payload - The input data for the tool
	 * @returns {Promise<TypeResponse>} - The result of the tool
	 */
	execute: (payload: TypePayload) => Promise<TypeResponse>;
}
