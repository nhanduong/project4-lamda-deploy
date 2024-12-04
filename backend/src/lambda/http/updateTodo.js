import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { updateTodo } from '../../bussinessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs'

const logger = createLogger('http')

const updateTodoHandler = async (event) => {
  logger.info('Starting updateToDo event')

  try {
    const updateRequest = JSON.parse(event.body)
    const { todoId } = event.pathParameters
    const userId = getUserId(event)

    await updateTodo(userId, todoId, updateRequest)

    logger.info('Completing updateToDo event')

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Todo updated successfully' })
    }
  } catch (error) {
    logger.error('Error updating todo', { error })

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update todo' })
    }
  }
}

export const handler = middy(updateTodoHandler)
  .use(httpErrorHandler())
  .use(cors({ credentials: true }))
