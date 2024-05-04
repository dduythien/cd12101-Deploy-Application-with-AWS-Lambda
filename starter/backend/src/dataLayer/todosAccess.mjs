import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

const dynamodbClient = DynamoDBDocument.from(new DynamoDB())

const todosTable = process.env.TODOS_TABLE;
const todosByUserIndexTable = process.env.TODOS_BY_USER_INDEX;

const getTodos = async (userId) => {
  const result = await dynamodbClient.scan({
    TableName: todosTable,
    FilterExpression: "#userId = :userId",
    ExpressionAttributeNames: { "#userId": "userId" },
    ExpressionAttributeValues: {
      ':userId': userId
    }
  });
  const items = result.Items;
  return items;
}

const createTodo = async (item) => {
  await dynamodbClient.put({
    TableName: todosTable,
    Item: item
  })
  return item;
}

const updateTodo = async (todoId, item) => {
  await dynamodbClient.update({
    TableName: todosTable,
    Key: {
      todoId
    },
    UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
    ExpressionAttributeNames: {
      "#name": "name"
    },
    ExpressionAttributeValues: {
      ":name": item.name,
      ":dueDate": item.dueDate,
      ":done": item.done
    }
  })
}

const deleteTodo = async (todoId) => {
  await dynamodbClient.delete({
    TableName: todosTable,
    Key: {
      todoId
    },
  })
}

const updateTodoImage = async (todoId, uploadUrl) => {
  await dynamodbClient.update({
    TableName: todosTable,
    Key: {
      todoId
    },
    UpdateExpression: 'set #attachmentUrl = :attachmentUrl',
    ExpressionAttributeNames: {
      "#attachmentUrl": "attachmentUrl"
    },
    ExpressionAttributeValues: {
      ":attachmentUrl": uploadUrl,
    }
  })
}

export {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  updateTodoImage
}