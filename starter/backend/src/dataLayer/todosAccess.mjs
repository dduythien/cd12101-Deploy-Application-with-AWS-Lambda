import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

const dynamodbClient = DynamoDBDocument.from(new DynamoDB())

const todosTable = process.env.TODOS_TABLE;
const todosByUserIndexTable = process.env.TODOS_BY_USER_INDEX;

const getTodos = async (userId) => {
  const result = await dynamodbClient.query({
    TableName: todosTable,
    // IndexName: todosByUserIndexTable,
    KeyConditionExpression: 'userId = :i',
    // ExpressionAttributeNames: {
    //   'userId': 'userId'
    // },
    ExpressionAttributeValues: {
      ':i': userId
    },
    ScanIndexForward: false
  })
  console.log("result: ", result)
  const items = result.Items;
  return items;
}

const createTodo = async (item) => {
  await dynamodbClient.put({
    TableName: todosTable,
    IndexName: todosByUserIndexTable,
    Item: item
  })
  return item;
}

const checkHasExistedTodo = async (userId, name) => {
  // const result = await dynamodbClient.query({
  //   TableName: todosTable,
  //   Key: { 'userId': userId, 'name': name },
  //   QueryFilter

  // });
  const result = await dynamodbClient.query({
    TableName: todosTable,
    // IndexName: todosByUserIndexTable,
    KeyConditionExpression: 'userId = :i',
    // ExpressionAttributeNames: {
    //   'userId': 'userId'
    // },
    FilterExpression: "name = :name",
    ExpressionAttributeValues: {
      ':i': userId,
      ':name': name
    },
    ScanIndexForward: false

  });

  // const result = await dynamodbClient.query({
  //   TableName: todosTable,
  //   IndexName: todosByUserIndexTable,
  //   KeyConditionExpression: 'userId = :i',
  //   ExpressionAttributeNames: {
  //     'name': 'name'
  //   },
  //   FilterExpression: "name = :name",

  //   ExpressionAttributeValues: {
  //     ':i': userId,
  //     ':name': name
  //   },
  // })
  console.log('result: ', result)

  const item = result.Item;
  return !!item;
}

const updateTodo = async (userId, todoId, item) => {
  await dynamodbClient.update({
    TableName: todosTable,
    Key: {
      userId,
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

const deleteTodo = async (userId, todoId) => {
  await dynamodbClient.delete({
    TableName: todosTable,
    Key: {
      userId,
      todoId
    },
  })
}

const updateTodoImage = async (userId, todoId, uploadUrl) => {
  await dynamodbClient.update({
    TableName: todosTable,
    Key: {
      userId,
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
  updateTodoImage,
  checkHasExistedTodo
}