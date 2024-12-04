import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { updateAttachedFileUrl } from '../../bussinessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs'

const logger = createLogger('http')

const generateUploadUrlHandler = async (event) => {
  logger.info('Starting generateUploadUrl event')

  try {
    const userId = getUserId(event)
    const { todoId } = event.pathParameters
    const uploadUrl = await updateAttachedFileUrl(userId, todoId)

    logger.info('Completing generateUploadUrl event')

    return {
      statusCode: 200,
      body: JSON.stringify({ uploadUrl })
    }
  } catch (error) {
    logger.error('Error generating upload URL', { error })
    throw error
  }
}

export const handler = middy(generateUploadUrlHandler)
  .use(httpErrorHandler())
  .use(cors({ credentials: true }))
