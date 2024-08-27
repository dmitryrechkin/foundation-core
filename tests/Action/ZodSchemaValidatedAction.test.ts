import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { ZodSchemaValidatedAction } from '../../src/Action/ZodSchemaValidatedAction';
import { type ActionInterface } from '../../src/Interface/ActionInterface';
import { EnumErrorCode } from '../../src/Type/ErrorCode';
import { type TypeResponse } from '../../src/Type/Response';

// Mock ActionInterface implementation
class MockAction implements ActionInterface<{ name: string }, { id: number }>
{
	public async execute(_payload: { name: string }): Promise<TypeResponse<{ id: number }>>
	{
		return {
			success: true,
			data: { id: 1 },
			messages: []
		};
	}
}

describe('SchemaValidatedAction', () =>
{
	it('should validate input and execute action with valid data', async () =>
	{
		// Define the input and output schemas
		const inputSchema = z.object({
			name: z.string()
		});
		const outputSchema = z.object({
			id: z.number()
		});

		// Create the action instance
		const mockAction = new MockAction();
		const validatedAction = new ZodSchemaValidatedAction(inputSchema, outputSchema, mockAction);

		// Execute the action with valid input
		const result = await validatedAction.execute({ name: 'John Doe' });

		// Assert that the action was successful and returned the expected output
		expect(result.success).toBe(true);
		expect(result.data).toEqual({ id: 1 });
	});

	it('should return validation error for invalid input', async () =>
	{
		// Define the input and output schemas
		const inputSchema = z.object({
			name: z.string()
		});
		const outputSchema = z.object({
			id: z.number()
		});

		// Create the action instance
		const mockAction = new MockAction();
		const validatedAction = new ZodSchemaValidatedAction(inputSchema, outputSchema, mockAction);

		// Execute the action with invalid input
		const result = await validatedAction.execute({ name: 123 } as any);

		// Assert that the action failed due to input validation error
		expect(result.success).toBe(false);
		expect(result.messages).toEqual([{ code: EnumErrorCode.VALIDATION_ERROR, text: 'Expected string, received number' }]);
	});

	it('should return validation error for invalid output', async () =>
	{
		// Define the input and output schemas
		const inputSchema = z.object({
			value: z.number()
		});
		const outputSchema = z.object({
			id: z.number()
		});

		// Create a mock action that returns invalid output
		class InvalidOutputMockAction implements ActionInterface<{ value: number }, { id: any }>
		{
			public async execute(_payload: { value: number }): Promise<TypeResponse<{ id: any }>>
			{
				return {
					success: true,
					data: { id: 'invalid' }, // Invalid output according to the schema
					messages: []
				};
			}
		}

		const invalidOutputMockAction = new InvalidOutputMockAction();
		const validatedAction = new ZodSchemaValidatedAction(inputSchema, outputSchema, invalidOutputMockAction);

		// Execute the action
		// @ts-ignore -- because we want to test input validation error
		const result = await validatedAction.execute({ value: 'String instead of number' });

		// Assert that the action failed due to output validation error
		expect(result.success).toBe(false);
		expect(result.messages).toEqual([{ code: EnumErrorCode.VALIDATION_ERROR, text: 'Expected number, received string' }]);
	});
});
