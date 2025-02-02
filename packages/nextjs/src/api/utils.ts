import { ClerkMiddleware } from '@clerk/clerk-sdk-node';
import type { NextApiRequest, NextApiResponse } from 'next';

// https://nextjs.org/docs/api-routes/api-middlewares#connectexpress-middleware-support
export function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: ClerkMiddleware) {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    void fn(req, res, result => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}
