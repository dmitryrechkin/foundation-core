import { ZodOptional, ZodNullable, ZodObject } from 'zod';

export class OptionalFieldStripperHelper
{
	/**
	 * Strips empty strings from the input data, converting them to undefined
	 * only if the corresponding field is optional in the schema.
	 *
	 * @param {Record<string, unknown>} data - The input data
	 * @returns {Record<string, unknown>} - The cleaned data with empty strings stripped from optional fields
	 */
	public static stripEmptyStrings(data: Record<string, unknown>, schema: ZodObject<any>): Record<string, unknown>
	{
		const cleanedData = { ...data };

		Object.entries(schema.shape).forEach(([key, schemaField]) =>
		{
			if (schemaField instanceof ZodOptional || schemaField instanceof ZodNullable)
			{
				if (cleanedData[key] === '')
				{
					cleanedData[key] = undefined;
				}
			}
		});

		return cleanedData;
	}
}
