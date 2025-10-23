import { beforeAll, describe, expect, it } from 'vitest';

import { Client } from 'src/buildClient';
import {
  AttachmentResponseSchema,
  DocumentSchema,
  UploadSchema,
  VaultSchema,
} from '../src/contract/schemas/documents';
import { ProjectSchema } from '../src/contract/schemas/projects';
import { buildConfiguredClient, requireEnv } from './utils';

let client: Client;
let bucketId: number;
let primaryVaultId: number;

beforeAll(async () => {
  bucketId = Number(requireEnv('BASECAMP_BUCKET_ID'));
  client = await buildConfiguredClient();
  primaryVaultId = await resolveVaultId(client, bucketId);
});

describe('Basecamp documents (live)', () => {
  it('manages vaults, documents, and uploads lifecycle', async () => {
    let nestedVaultId: number | undefined;
    let documentId: number | undefined;
    let uploadId: number | undefined;

    try {
      // Get the primary vault
      const vaultGetResponse = await client.vaults.get({
        params: {
          bucketId,
          vaultId: primaryVaultId,
        },
      });

      expect(vaultGetResponse.status).toBe(200);
      VaultSchema.parse(vaultGetResponse.body);

      // Create a nested vault for testing
      const vaultCreateResponse = await client.vaults.create({
        params: {
          bucketId,
          parentVaultId: primaryVaultId,
        },
        body: {
          title: `Test Vault ${Date.now()}`,
        },
      });

      expect(vaultCreateResponse.status).toBe(201);
      const createdVault = VaultSchema.parse(vaultCreateResponse.body);
      nestedVaultId = createdVault.id;

      // Type assertion for subsequent operations
      if (nestedVaultId === undefined) {
        throw new Error('Vault ID is required after creation');
      }

      // List vaults under the primary vault
      const vaultsListResponse = await client.vaults.list({
        params: {
          bucketId,
          parentVaultId: primaryVaultId,
        },
      });

      expect(vaultsListResponse.status).toBe(200);
      const vaultsList = vaultsListResponse.body;
      expect(Array.isArray(vaultsList)).toBe(true);

      // Update the vault
      const vaultUpdateResponse = await client.vaults.update({
        params: {
          bucketId,
          vaultId: nestedVaultId,
        },
        body: {
          title: `Updated Test Vault ${Date.now()}`,
        },
      });

      expect(vaultUpdateResponse.status).toBe(200);
      const updatedVault = VaultSchema.parse(vaultUpdateResponse.body);
      expect(updatedVault.title).toContain('Updated');

      // Test document operations
      const documentTitle = `Test Document ${Date.now()}`;
      const documentCreateResponse = await client.documents.create({
        params: {
          bucketId,
          vaultId: nestedVaultId,
        },
        body: {
          title: documentTitle,
          content: '<div><strong>Test content</strong> created by the contract suite.</div>',
          status: 'active',
        },
      });

      expect(documentCreateResponse.status).toBe(201);
      const createdDocument = DocumentSchema.parse(documentCreateResponse.body);
      documentId = createdDocument.id;

      // Type assertion for subsequent operations
      if (documentId === undefined) {
        throw new Error('Document ID is required after creation');
      }

      // Get the document
      const documentGetResponse = await client.documents.get({
        params: {
          bucketId,
          documentId,
        },
      });

      expect(documentGetResponse.status).toBe(200);
      DocumentSchema.parse(documentGetResponse.body);

      // List documents in the vault
      const documentsListResponse = await client.documents.list({
        params: {
          bucketId,
          vaultId: nestedVaultId,
        },
      });

      expect(documentsListResponse.status).toBe(200);
      const documentsList = documentsListResponse.body;
      expect(Array.isArray(documentsList)).toBe(true);
      expect(documentsList.some((doc) => doc.id === documentId)).toBe(true);

      // Update the document
      const documentUpdateResponse = await client.documents.update({
        params: {
          bucketId,
          documentId,
        },
        body: {
          title: `${documentTitle} (updated)`,
          content: '<div>This is an updated test document.</div>',
        },
      });

      expect(documentUpdateResponse.status).toBe(200);
      const updatedDocument = DocumentSchema.parse(documentUpdateResponse.body);
      expect(updatedDocument.title).toContain('(updated)');

      // Test upload operations with attachments
      // First, create an attachment (simulate a file upload)
      const testFileContent = new TextEncoder().encode('Test file content for contract suite');
      const attachmentCreateResponse = await client.attachments.create({
        query: {
          name: 'test-file.txt',
        },
        body: testFileContent.buffer as ArrayBuffer,
      });

      expect(attachmentCreateResponse.status).toBe(201);
      const attachmentResponse = AttachmentResponseSchema.parse(attachmentCreateResponse.body);
      const attachableSgid = attachmentResponse.attachable_sgid;

      // Create an upload using the attachment
      const uploadCreateResponse = await client.uploads.create({
        params: {
          bucketId,
          vaultId: nestedVaultId,
        },
        body: {
          attachable_sgid: attachableSgid,
          description: '<div>Test upload created by the contract suite.</div>',
          base_name: 'contract-test-file',
        },
      });

      expect(uploadCreateResponse.status).toBe(201);
      const createdUpload = UploadSchema.parse(uploadCreateResponse.body);
      uploadId = createdUpload.id;

      // Type assertion for subsequent operations
      if (uploadId === undefined) {
        throw new Error('Upload ID is required after creation');
      }

      // Get the upload
      const uploadGetResponse = await client.uploads.get({
        params: {
          bucketId,
          uploadId,
        },
      });

      expect(uploadGetResponse.status).toBe(200);
      UploadSchema.parse(uploadGetResponse.body);

      // List uploads in the vault
      const uploadsListResponse = await client.uploads.list({
        params: {
          bucketId,
          vaultId: nestedVaultId,
        },
      });

      expect(uploadsListResponse.status).toBe(200);
      const uploadsList = uploadsListResponse.body;
      expect(Array.isArray(uploadsList)).toBe(true);
      expect(uploadsList.some((upload) => upload.id === uploadId)).toBe(true);

      // Update the upload
      const uploadUpdateResponse = await client.uploads.update({
        params: {
          bucketId,
          uploadId,
        },
        body: {
          description: '<div>Updated test upload.</div>',
          base_name: 'updated-test-file',
        },
      });

      expect(uploadUpdateResponse.status).toBe(200);
      const updatedUpload = UploadSchema.parse(uploadUpdateResponse.body);
      expect(updatedUpload.description).toContain('Updated');
    } finally {
      // Clean up: trash upload, document, and vault (in reverse order of creation)
      if (uploadId !== undefined) {
        const trashUploadResponse = await client.uploads.trash({
          params: {
            bucketId,
            uploadId,
          },
        });
        expect(trashUploadResponse.status).toBe(204);
      }

      if (documentId !== undefined) {
        const trashDocumentResponse = await client.documents.trash({
          params: {
            bucketId,
            documentId,
          },
        });
        expect(trashDocumentResponse.status).toBe(204);
      }

      if (nestedVaultId !== undefined) {
        const trashVaultResponse = await client.vaults.trash({
          params: {
            bucketId,
            vaultId: nestedVaultId,
          },
        });
        expect(trashVaultResponse.status).toBe(204);
      }
    }
  }, 20000);
});

async function resolveVaultId(client: Client, bucket: number): Promise<number> {
  const response = await client.projects.get({
    params: {
      projectId: bucket,
    },
  });

  if (response.status !== 200) {
    throw new Error(`Failed to load project for vault discovery (${response.status}).`);
  }

  const project = ProjectSchema.parse(response.body);
  const dock = Array.isArray(project.dock) ? project.dock : [];
  const vault = dock.find((entry) => entry.name === 'vault' && entry.enabled !== false);

  if (!vault) {
    throw new Error('Project does not expose a vault in the dock.');
  }

  return vault.id;
}
