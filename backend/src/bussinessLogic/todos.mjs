import * as uuid from 'uuid'
import { TodosAccess } from '../dataLayer/todosAccess.mjs'
import {
  generateAttachmentUrl,
  getFormattedUrl
} from '../fileStorage/attachmentUtils.mjs'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('businessLogic')
const todosAccess = new TodosAccess()

export const getToDosByUserId = async (userId) => {
  logger.info(`Fetching todos for user with ID: ${userId}`)
  return todosAccess.getToDosByUserId(userId)
}

export const createTodo = async (newTodo, userId) => {
  logger.info(`Creating a new todo for user with ID: ${userId}`)
  const todoId = uuid.v4()

  const todoItem = {
    todoId,
    userId,
    createdAt: new Date().toISOString(),
    done: false,
    ...newTodo
  }

  return await todosAccess.create(todoItem)
}

export const updateTodo = async (userId, todoId, updateTodo) => {
  logger.info(`Updating todo with ID: ${todoId} for user with ID: ${userId}`)
  return await todosAccess.update(userId, todoId, updateTodo)
}

export const deleteTodo = async (userId, todoId) => {
  logger.info(`Deleting todo with ID: ${todoId} for user with ID: ${userId}`)
  return await todosAccess.delete(userId, todoId)
}

export const updateAttachedFileUrl = async (userId, todoId) => {
  logger.info(
    `Updating attachment URL for todo with ID: ${todoId} for user with ID: ${userId}`
  )
  const attachmentUrl = await getFormattedUrl(todoId)
  const uploadUrl = await generateAttachmentUrl(todoId)
  await todosAccess.updateAttachedFileUrl(userId, todoId, attachmentUrl)
  return uploadUrl
}
