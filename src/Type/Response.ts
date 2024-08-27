import { z } from 'zod';
import { ZodSchema } from 'zod';

export const messageSchema = z.object({
	code: z.string(),
	text: z.string()
});

export const createResponseSchema = <TypeObject extends ZodSchema>(dataSchema: TypeObject): ZodSchema =>
	z.object({
		success: z.boolean(),
		messages: z.array(messageSchema).optional(),
		data: dataSchema.optional()
	});

export interface TypeMessage extends z.infer<typeof messageSchema> {}

export interface TypeResponse<TypeObject>
{
	success: boolean;
	messages?: TypeMessage[];
	data?: TypeObject | undefined;
}
