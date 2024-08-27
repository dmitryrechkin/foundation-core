# Foundation Core

**Foundation Core is a TypeScript library that provides a set of foundational classes, interfaces, and tools to support the development of domain-driven and AI applications.** This package serves as the core framework for building scalable and maintainable applications by offering reusable abstractions.

## Installation

Install the package using pnpm:

```bash
pnpm add @dmitryrechkin/foundation-core
```

## Overview

This package is organized into several key areas:

1. **Interfaces**: Define the contracts for actions, services, transformers, and tools.
2. **Service**: Provide base classes and utilities for implementing services.
3. **Action**: Offer structured actions that encapsulate business logic and return a predictable format, making them ideal for implementing API integrations.
4. **Tool**: Include helper tools that wrap actions and services for use by AI, particularly when working with Zod Schemas to ensure data validation and consistency.
5. **Type**: Define common types used across actions, services, and tools.

### 1. Interfaces

**Interfaces** define the contracts that must be implemented by actions, services, transformers, and tools. These interfaces ensure consistency and reusability across different parts of your application.

#### Available Interfaces

- **`ActionInterface`**: Defines the contract for actions that encapsulate business logic and return a predictable structure for integration with APIs.

  ```typescript
  export interface ActionInterface<TypePayload, TypeObject> {
      execute(payload: TypePayload): Promise<TypeResponse<TypeObject>>;
  }
  ```

  **Example Usage:**
  ```typescript
  class ExampleAction implements ActionInterface<InputType, OutputType> {
      async execute(payload: InputType): Promise<TypeResponse<OutputType>> {
          // Implement your business logic here
      }
  }
  ```

- **`ServiceInterface`**: Defines the contract for services that perform domain-specific tasks, ensuring a consistent approach to service implementation.

  ```typescript
  export interface ServiceInterface<InputType, OutputType> {
      execute(payload: InputType): Promise<OutputType>;
  }
  ```

  **Example Usage:**
  ```typescript
  class ExampleService implements ServiceInterface<InputType, OutputType> {
      async execute(payload: InputType): Promise<OutputType> {
          // Service logic here
      }
  }
  ```

- **`TransformerInterface`**: Defines the contract for transformers that convert data from one format to another, ensuring consistency in data transformations.

  ```typescript
  export interface TransformerInterface<InputType, OutputType> {
      transform(input: InputType | undefined): OutputType | undefined;
  }
  ```

  **Example Usage:**
  ```typescript
  class ExampleTransformer implements TransformerInterface<InputType, OutputType> {
      transform(input: InputType | undefined): OutputType | undefined {
          // Transformation logic here
      }
  }
  ```

- **`ToolInterface`**: Defines the contract for tools that assist in building and executing actions and services, particularly in enhancing their interaction with AI systems.

  ```typescript
  interface ToolInterface<TypePayload, TypeResponse>
  {
      readonly name: string;
      readonly description: string;
      readonly parameters: ZodSchema<TypePayload>;
      execute: (payload: TypePayload) => Promise<TypeResponse>;
  }
  ```

**Example Usage:**
  ```typescript
  import { ZodSchema, z } from 'zod';

  // Define a payload type and response type
  type GreetPayload = {
      name: string;
  };

  type GreetResponse = {
      message: string;
  };

  // Implement the ToolInterface
  class GreetTool implements ToolInterface<GreetPayload, GreetResponse> {
      readonly name = 'GreetTool';
      readonly description = 'A tool that greets a user by name.';
      readonly parameters: ZodSchema<GreetPayload> = z.object({
          name: z.string().min(1, 'Name is required'),
      });

      async execute(payload: GreetPayload): Promise<GreetResponse> {
          const { name } = payload;
          return { message: `Hello, ${name}!` };
      }
  }
  ```

### 2. Service

**Service** classes provide the base implementation for various domain-specific tasks. These classes implement the `ServiceInterface` and offer a standardized way to define services in your application.

#### Available Services

- **`ZodSchemaValidatedService`**: A service class that validates input using Zod schemas before performing the service logic. This service is particularly useful when you need to ensure that the input data adheres to a specific structure before processing.

  **Example Usage:**
  ```typescript
  import { ZodSchemaValidatedService } from '@dmitryrechkin/foundation-core';
  import { z } from 'zod';

  const schema = z.object({
      id: z.string(),
      name: z.string(),
  });

  class ExampleService extends ZodSchemaValidatedService<InputType, OutputType> {
      async execute(payload: InputType): Promise<{ success: boolean; data?: OutputType; message?: string }> {
          // Service logic here
      }
  }
  ```

### 3. Action

**Action** classes encapsulate business logic and can include validation using schemas. These classes implement the `ActionInterface` and are designed to be highly reusable and testable. Actions are particularly useful for implementing API integrations, as they return results in a predictable format: `{ success, messages, data }`.

#### Available Actions

- **`ZodSchemaValidatedAction`**: An action class that uses Zod schemas to validate input before executing the action. The result is returned in a structured format that includes a success flag, messages, and data, making it ideal for API integrations.

  **Example Usage:**
  ```typescript
  import { ZodSchemaValidatedAction } from '@dmitryrechkin/foundation-core';
  import { z } from 'zod';

  const schema = z.object({
      id: z.string(),
      data: z.any(),
  });

  class ExampleAction extends ZodSchemaValidatedAction<InputType, OutputType> {
      async execute(payload: InputType): Promise<{ success: boolean; data?: OutputType; message?: string }> {
          // Action logic here
      }
  }
  ```

### 4. Tool

**Tools** are utility classes that wrap actions and services, transforming them into tools that can be executed as functions by AI systems. This makes it easier to use existing business logic in AI systems, where structured inputs and outputs are essential.

#### Available Tools

- **`ActionTool`**: A utility class that wraps an `ActionInterface`, transforming it into a tool that can be used by AI systems. This class allows an action to be described by a name, description, and a set of parameters, and then executed as a tool.

  **Example Usage:**
  ```typescript
  import { ActionTool } from '@dmitryrechkin/foundation-core';
  import { ActionInterface } from '@dmitryrechkin/foundation-core';

  class CustomAction implements ActionInterface<InputType, OutputType> {
      async execute(payload: InputType): Promise<OutputType> {
          // Action execution logic here
      }
  }

  const customAction = new CustomAction();

  const actionTool = new ActionTool<InputType, OutputType>(
      customAction,
      'CustomActionTool',
      'A custom tool for executing an action',
      { param1: 'Description of param1', param2: 'Description of param2' }
  );

  // Example of executing the action as a tool
  const result = await actionTool.execute({ param1: 'value1', param2: 'value2' });
  ```

- **`ServiceTool`**: A utility class that wraps a `ServiceInterface`, transforming it into a tool that can be used by AI systems. This class allows a service to be described by a name, description, and a set of parameters, and then executed as a tool.

  **Example Usage:**
  ```typescript
  import { ServiceTool } from '@dmitryrechkin/foundation-core';
  import { ServiceInterface } from '@dmitryrechkin/foundation-core';

  class CustomService implements ServiceInterface<InputType, OutputType> {
      async execute(payload: InputType): Promise<OutputType> {
          // Service execution logic here
      }
  }

  const customService = new CustomService();

  const serviceTool = new ServiceTool<InputType, OutputType>(
      customService,
      'CustomServiceTool',
      'A custom tool for executing a service',
      { param1: 'Description of param1', param2: 'Description of param2' }
  );

  // Example of executing the service as a tool
  const result = await serviceTool.execute({ param1: 'value1', param2: 'value2' });
  ```

### 5. Type

**Types** are common data structures that are used across actions, services, and tools. These types help ensure consistency and type safety throughout your application.

#### Available Types

- **`ErrorCode`**: A type representing various error codes used in actions and services.

  **Example Usage:**
  ```typescript
  import { ErrorCode } from '@dmitryrechkin/foundation-core';

  const error: ErrorCode = 'INVALID_INPUT';
  ```

- **`Response`**: A type representing standardized response structures.

  **Example Usage:**
  ```typescript
  import { ResponseHelper } from '@dmitryrechkin/foundation-core';

  const successResponse = ResponseHelper.createSuccessResponse(outputData);
  const errorResponse = ResponseHelper.createErrorResponse('An error occurred');
  ```

## Installation & Setup

Install the package using pnpm:

```bash
pnpm add @dmitryrechkin/foundation-core
```

Ensure your project is set up to handle TypeScript and supports ES modules, as this library is built with modern JavaScript standards.

## Rationale

### Extensibility and Reusability

The `Foundation Core` package is built with extensibility and reusability in mind. By defining clear interfaces and providing base classes for actions, services, and tools, this library allows developers to create modular and maintainable code that can easily be extended or adapted for different projects.

- **Extensibility**: Easily extend or customize the provided base classes to fit specific business requirements without altering the core framework.
- **Reusability**: Implement once, reuse everywhere. The patterns and abstractions provided in this library enable you to build components that can be reused across different projects or within various parts of the same application.

### Ideal Use Cases

- **API Integrations**: Streamline the development of API integrations by using the predefined interfaces and action classes that return standardized responses.
- **Domain-Driven Design (DDD)**: Implement DDD principles by leveraging services and actions that encapsulate specific business logic.
- **AI Applications**: Use the `ToolInterface` and related classes to create tools that can be utilized by AI systems, ensuring that business logic is accessible in a structured and consistent manner.

## Contributing

Contributions are welcome! If you'd like to contribute, please fork the repository and submit a pull request. Ensure that your code is well-tested and adheres to the coding standards established in this project.

### Running Tests

Run the test suite using pnpm:

```bash
pnpm test
```
