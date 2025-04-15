import { z } from 'zod';

/**
 * Validates data against a schema and returns the result
 * @param schema The zod schema to validate against
 * @param data The data to validate
 * @returns The validated data or null if validation fails
 */
export function validateData<T>(schema: z.ZodType<T>, data: unknown): T | null {
  try {
    return schema.parse(data);
  } catch (error) {
    return null;
  }
}

/**
 * Validates data against a schema and returns the result with errors
 * @param schema The zod schema to validate against
 * @param data The data to validate
 * @returns Object containing the validated data and/or errors
 */
export function validateWithErrors<T>(schema: z.ZodType<T>, data: unknown): { 
  data: T | null; 
  success: boolean;
  errors: z.ZodError | null;
} {
  try {
    const validData = schema.parse(data);
    return {
      data: validData,
      success: true,
      errors: null
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        data: null,
        success: false,
        errors: error
      };
    }
    return {
      data: null,
      success: false,
      errors: null
    };
  }
}

/**
 * Format Zod errors into a simple object for API responses
 * @param error The Zod error object
 * @returns A simplified error object
 */
export function formatZodError(error: z.ZodError): Record<string, string[]> {
  const formattedErrors: Record<string, string[]> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    if (!formattedErrors[path]) {
      formattedErrors[path] = [];
    }
    formattedErrors[path].push(err.message);
  });
  
  return formattedErrors;
} 