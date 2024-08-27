import { ZodSchema, type infer as Infer } from 'zod';
import { type ServiceInterface } from '../Interface/ServiceInterface';
import { type ToolInterface } from '../Interface/ToolInterface';
import { ZodSchemaValidatedService } from '../Service/ZodSchemaValidatedService';

/**
 * ServiceTool is a specialized class that will use a given service as a tool.
 */
export class ServiceTool<TypePayloadSchema extends ZodSchema, TypeResponseSchema extends ZodSchema>
	extends ZodSchemaValidatedService<TypePayloadSchema, TypeResponseSchema>
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
	 * @param {ServiceInterface<Infer<TypePayloadSchema>, Infer<TypeResponseSchema>>} service - The service to wrap
	 */
	constructor(
		name: string,
		description: string,
		payloadSchema: TypePayloadSchema,
		responseSchema: TypeResponseSchema,
		service: ServiceInterface<Infer<TypePayloadSchema>, Infer<TypeResponseSchema>>
	)
	{
		super(payloadSchema, responseSchema, service);

		this.name = name;
		this.description = description;
		this.parameters = payloadSchema;
	}
}
