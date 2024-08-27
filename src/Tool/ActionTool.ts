import { ZodSchema, type infer as Infer } from 'zod';
import { type ToolInterface } from '../Interface/ToolInterface';
import { ZodSchemaValidatedAction } from '../Action/ZodSchemaValidatedAction';
import { type ActionInterface } from '../Interface/ActionInterface';

/**
 * ActionTool is a specialized class that will use a given action as a tool.
 */
export class ActionTool<TypePayloadSchema extends ZodSchema, TypeResponseSchema extends ZodSchema>
	extends ZodSchemaValidatedAction<TypePayloadSchema, TypeResponseSchema>
	implements ToolInterface<Infer<TypePayloadSchema>, Infer<TypeResponseSchema>>
{
	public readonly name: string;
	public readonly description: string;
	public readonly parameters: TypePayloadSchema;

	/**
	 * Constructor.
	 *
	 * @param {string} name - The name of the tool
	 * @param {string} description - The description of the tool
	 * @param {TypePayloadSchema} payloadSchema - The Zod schema for the input data
	 * @param {TypeResponseSchema} responseSchema - The Zod schema for the output data
	 * @param {ActionInterface<Infer<TypePayloadSchema>, Infer<TypeResponseSchema>>} action - The action to wrap
	 */
	constructor(
		name: string,
		description: string,
		payloadSchema: TypePayloadSchema,
		responseSchema: TypeResponseSchema,
		action: ActionInterface<Infer<TypePayloadSchema>, Infer<TypeResponseSchema>>
	)
	{
		super(payloadSchema, responseSchema, action);

		this.name = name;
		this.description = description;
		this.parameters = payloadSchema;
	}
}
