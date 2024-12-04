import { S3Client } from '@aws-sdk/client-s3'
import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getToDosByUserId } from '../../bussinessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs'

const logger = createLogger('http')
const s3Client = new S3Client()

const bucketName = process.env.TODOS_S3_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION, 10)

const getTodosHandler = async (event) => {
  logger.info('Starting getToDos event')
  const userId = getUserId(event)
  const items = await getToDosByUserId(userId)
  logger.info('Completing getToDos event')

  return {
    statusCode: 200,
    body: JSON.stringify({ items })
  }
}

export const handler = middy(getTodosHandler)
  .use(httpErrorHandler())
  .use(cors({ credentials: true }))
