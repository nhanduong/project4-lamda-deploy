import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import AWSXRay from 'aws-xray-sdk-core'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('dataLayer')

export class TodosAccess {
  constructor(
    documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
    todosTable = process.env.TODOS_TABLE,
    index = process.env.TODOS_CREATED_AT_INDEX
  ) {
    this.dynamoDbClient = DynamoDBDocument.from(documentClient)
    this.todosTable = todosTable
    this.index = index
  }

  async getToDosByUserId(userId) {
    logger.info('Getting all todos for user', { userId })

    const params = {
      TableName: this.todosTable,
      IndexName: this.index,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }

    const result = await this.dynamoDbClient.query(params)
    return result.Items
  }

  async create(newItem) {
    logger.info('Creating a new todo', { newItem })

    const params = {
      TableName: this.todosTable,
      Item: newItem
    }

    await this.dynamoDbClient.put(params)
    return newItem
  }

  async update(userId, todoId, updateItem = {}) {
    logger.info('Updating existing todo', { userId, todoId, updateItem })

    const { name, dueDate, done } = updateItem
    const params = {
      TableName: this.todosTable,
      Key: { userId, todoId },
      UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeNames: { '#name': 'name' },
      ExpressionAttributeValues: {
        ':name': name,
        ':dueDate': dueDate,
        ':done': done
      },
      ReturnValues: 'UPDATED_NEW'
    }

    await this.dynamoDbClient.update(params)
  }

  async updateAttachedFileUrl(userId, todoId, attachmentUrl) {
    logger.info('Updating attachment URL', { userId, todoId, attachmentUrl })

    const params = {
      TableName: this.todosTable,
      Key: { userId, todoId },
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl
      },
      ReturnValues: 'UPDATED_NEW'
    }

    await this.dynamoDbClient.update(params)
  }

  async delete(userId, todoId) {
    logger.info('Deleting a todo', { userId, todoId })

    const params = {
      TableName: this.todosTable,
      Key: { userId, todoId }
    }

    await this.dynamoDbClient.delete(params)
  }
}
