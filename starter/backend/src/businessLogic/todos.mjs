import { v4 as uuidv4 } from 'uuid'
import { getTodos, createTodo, updateTodo, deleteTodo, updateTodoImage } from '../dataLayer/todosAccess.mjs';
import { generateImageUrl } from '../fileStorage/attachmentUtils.mjs';
const getTodosAction = async (userId) => {
  const result = await getTodos(userId);
  return result;
}

const createTodoAction = async (userId, item) => {
  const newTodo = {
    ...item,
    userId,
    todoId: uuidv4()
  }
  const result = await createTodo(newTodo);
  return result;
}

const updateTodoAction = async (todoId, item) => {
  await updateTodo(todoId, item);
}

const deleteTodoAction = async (todoId) => {
  await deleteTodo(todoId);
}

const uploadImageAction = async (todoId, image) => {
  const imageId = uuidv4()
  const imageUrl = generateImageUrlAction(imageId);

  const newItem = {
    groupId,
    timestamp,
    imageId,
    imageUrl: `https://${bucketName}.s3.amazonaws.com/${imageId}`,
    ...newImage
  }
}

const generateImageUrlAction = async (todoId) => {
  const imageId = uuidv4()
  const { presignedUrl, imageUrl } = await generateImageUrl(imageId);
  await updateTodoImage(todoId, imageUrl);
  return presignedUrl
}

export {
  getTodosAction,
  createTodoAction,
  updateTodoAction,
  deleteTodoAction,
  uploadImageAction,
  generateImageUrlAction
}