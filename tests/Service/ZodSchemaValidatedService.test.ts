import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { ZodSchemaValidatedService } from '../../src/Service/ZodSchemaValidatedService';
import { type ServiceInterface } from '../../src/Interface/ServiceInterface';

// Mock ServiceInterface implementation
class MockService implements ServiceInterface<{ name: string }, { id: number }>
{
	public async execute(_payload: { name: string }): Promise<{ id: number }>
	{
		return { id: 1 };
	}
}

describe('ZodSchemaValidatedService', () =>
{
	it('should validate input and execute service with valid data', async () =>
	{
		// Define the input and output schemas
		const inputSchema = z.object({
			name: z.string()
		});
		const outputSchema = z.object({
			id: z.number()
		});

		// Create the service instance
		const mockService = new MockService();
		const validatedService = new ZodSchemaValidatedService(inputSchema, outputSchema, mockService);

		// Execute the service with valid input
		const result = await validatedService.execute({ name: 'John Doe' });

		// Assert that the service executed successfully and returned the expected output
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

		// Create the service instance
		const mockService = new MockService();
		const validatedService = new ZodSchemaValidatedService(inputSchema, outputSchema, mockService);

		// Execute the service with invalid input
		const result = await validatedService.execute({ name: 123 } as any);

		// Assert that the service failed due to input validation error
		expect(result.success).toBe(false);
		expect(result.error?.issues).toEqual([
			{
				code: 'invalid_type',
				expected: 'string',
				received: 'number',
				path: ['name'],
				message: 'Expected string, received number'
			}
		]);
	});

	it('should return validation error for invalid output', async () =>
	{
		// Define the input and output schemas
		const inputSchema = z.object({
			name: z.string()
		});
		const outputSchema = z.object({
			id: z.number()
		});

		// Create a mock service that returns invalid output
		class InvalidOutputMockService implements ServiceInterface<{ name: string }, { id: any }>
		{
			public async execute(_payload: { name: string }): Promise<{ id: any }>
			{
				return { id: 'invalid' }; // Invalid output according to the schema
			}
		}

		const invalidOutputMockService = new InvalidOutputMockService();
		const validatedService = new ZodSchemaValidatedService(inputSchema, outputSchema, invalidOutputMockService);

		// Execute the service
		const result = await validatedService.execute({ name: 'John Doe' });

		// Assert that the service failed due to output validation error
		expect(result.success).toBe(false);
		expect(result.error?.issues).toEqual([
			{
				code: 'invalid_type',
				expected: 'number',
				received: 'string',
				path: ['id'],
				message: 'Expected number, received string'
			}
		]);
	});
});
