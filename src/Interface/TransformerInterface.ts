/**
 * Transformer is a class implement transformation of data from one format to another.
 * It is typically helpful when you want to have common data types and be able to transform them to different formats.
 */
export interface TransformerInterface<InputType, OutputType>
{
	/**
	 * Transforms input of type InputType to output of type OutputType
	 *
	 * @param {InputType | undefined} input - input data to be transformed
	 * @returns {OutputType | undefined} - transformed data
	 */
	transform(input: InputType | undefined): OutputType | undefined;
}
