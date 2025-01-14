import { Readable } from 'node:stream'
import { z } from 'zod'

import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'

const uploadImageInput = z.object({
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable),
})

type UploadImageInput = z.input<typeof uploadImageInput>

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']

export async function uploadImage(input: UploadImageInput) {
  const { contentType, contentStream, fileName } = uploadImageInput.parse(input)

  if (!allowedMimeTypes.includes(contentType)) {
    throw new Error('Invalid file format.')
  }

  // Upload the image to an external service (Cloudflare R2)

  await db.insert(schema.uploads).values({
    name: fileName,
    remoteKey: fileName,
    remoteUrl: fileName,
  })
}
