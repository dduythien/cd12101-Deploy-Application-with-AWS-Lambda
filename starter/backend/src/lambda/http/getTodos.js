import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getTodosAction } from '../../businessLogic/todos.mjs'
import { getUserId } from '../utils.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    // Write your logic here
    const userId = getUserId(event);
    const items = await getTodosAction(userId);
    console.log('items: ', items)
    return JSON.stringify({
      items
    })
  })