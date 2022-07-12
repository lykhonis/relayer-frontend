import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'

type HttpMethod = 'GET' | 'PUT' | 'POST' | 'DELETE'

export const method =
  (method: HttpMethod | HttpMethod[], handler: NextApiHandler) =>
  (req: NextApiRequest, res: NextApiResponse) => {
    if (
      method === req.method ||
      (Array.isArray(method) && method.includes(req.method as HttpMethod))
    ) {
      return handler(req, res)
    } else {
      return res.status(405).json({})
    }
  }
