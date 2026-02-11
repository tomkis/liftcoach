import { initTRPC } from '@trpc/server'

import type { ContractContext } from './contract'

export const trpcInstance = initTRPC.context<ContractContext>().create({
  allowOutsideOfServer: true,
})

const trpcProcedure = trpcInstance.procedure.use(
  trpcInstance.middleware(async opts => {
    const start = Date.now()
    console.debug('Start request: ', opts.path)

    const result = await opts.next()

    const durationMs = Date.now() - start
    const meta = { path: opts.path, type: opts.type, durationMs }

    if (durationMs > 1000) {
      console.warn('Slow request: ', opts.path, durationMs)
    }

    if (result.ok) {
      console.debug('OK request timing:', meta)
    } else {
      console.error('Non-OK request', result.error)
    }

    return result
  })
)

export const trpcProcedureAuthProcedure = trpcProcedure.use(async function isAuthed(opts) {
  const { ctx } = opts

  const result = await opts.next({
    ctx: {
      ...ctx,
      session: { userId: 'local-user' },
    },
  })

  return result
})
