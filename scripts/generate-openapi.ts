import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { generateOpenApi } from '@ts-rest/open-api';
import { generateSchema } from '@anatine/zod-openapi';
import { z } from 'zod';
import { contract } from '../src/contract/index';
import type { SchemaTransformerSync } from '@ts-rest/open-api';

const ZOD_3_SYNC: SchemaTransformerSync = ({ schema }) => {
  if (schema instanceof z.ZodType) {
    return generateSchema(schema);
  }
  return null;
};

const openApiDocument = generateOpenApi(
  contract,
  {
    info: {
      title: 'Basecamp API',
      version: '1.0.7',
      description: 'Type-safe Basecamp API client.',
    },
    servers: [
      {
        url: 'https://3.basecampapi.com/{accountId}',
        description: 'Basecamp 3 API',
        variables: {
          accountId: {
            default: 'your-account-id',
            description: 'Your Basecamp account ID',
          },
        },
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          description: 'OAuth 2.0 Bearer token authentication',
        },
      },
    },
  },
  {
    schemaTransformer: ZOD_3_SYNC,
    operationMapper: (operation, appRoute, operationId) => {
      const metadata = appRoute.metadata as
        | {
            tag?: string;
            operationId?: string;
            docsPath?: string;
          }
        | undefined;

      return {
        ...operation,
        ...(metadata?.tag ? { tags: [metadata.tag] } : {}),
        ...(metadata?.operationId ? { operationId: metadata.operationId } : {}),
        ...(metadata?.docsPath
          ? {
              externalDocs: {
                description: 'Official Basecamp API Documentation',
                url: `https://github.com/basecamp/bc3-api${metadata.docsPath}`,
              },
            }
          : {}),
        security: [{ BearerAuth: [] }],
      };
    },
  },
) as any;

// Add x-client-method to all operations
for (const path in openApiDocument.paths) {
  for (const method in openApiDocument.paths[path]) {
    const operation = openApiDocument.paths[path][method];
    if (operation && typeof operation === 'object' && 'operationId' in operation) {
      // Extract the client method from the operationId (e.g., "projects.list" -> "projects.list")
      operation['x-client-method'] = operation.operationId;
    }
  }
}

const outputPath = resolve(__dirname, '../openapi.json');
writeFileSync(outputPath, JSON.stringify(openApiDocument, null, 2));

console.log(`OpenAPI document generated successfully at ${outputPath}`);
