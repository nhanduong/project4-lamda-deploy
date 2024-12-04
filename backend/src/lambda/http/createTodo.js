import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { createTodo } from '../../bussinessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs'

const logger = createLogger('http')

const createTodoHandler = async (event) => {
  logger.info('Starting createTodo event')

  try {
    const newTodo = JSON.parse(event.body)
    const userId = getUserId(event)
    const item = await createTodo(newTodo, userId)

    logger.info('Completing createTodo event')

    return {
      statusCode: 201,
      body: JSON.stringify({ item })
    }
  } catch (error) {
    logger.error('Error creating todo', { error })
    throw new Error('Error creating todo')
  }
}

export const handler = middy(createTodoHandler)
  .use(httpErrorHandler())
  .use(cors({ credentials: true }))
