import type { TypeResponse } from '../Type/Response';

export class ResponseHelper
{
	/**
	 * Creates a standardized error response.
	 *
	 * @param {string} code - The error code.
	 * @param {string} message - The error message.
	 * @returns {TypeResponse<TypeObject>} - A standardized error response.
	 */
	public static createErrorResponse<TypeObject>(code: string, message: string): TypeResponse<TypeObject>
	{
		return {
			success: false,
			messages: [{ code, text: message }]
		};
	}
}
