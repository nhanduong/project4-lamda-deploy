import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { deleteTodo } from '../../bussinessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs'

const logger = createLogger('http')

const deleteTodoHandler = async (event) => {
  logger.info('Starting deleteTodo event')

  const { todoId } = event.pathParameters
  const userId = getUserId(event)

  await deleteTodo(userId, todoId)

  logger.info('Completing deleteTodo event')

  return {
    statusCode: 204
  }
}

export const handler = middy(deleteTodoHandler)
  .use(httpErrorHandler())
  .use(cors({ credentials: true }))
