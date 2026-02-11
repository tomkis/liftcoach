import type { ContractContext } from '@/mobile/api'
import { router } from '@/mobile/api'
import { TRPCLink } from '@trpc/client'
import type { Contract } from '@/mobile/api'
import { observable } from '@trpc/server/observable'

export const localTRPCLink = (ctx: ContractContext): TRPCLink<Contract> => {
  const caller = router.createCaller(ctx)

  return () => {
    return ({ op }) => {
      return observable(observer => {
        const { path, input } = op

        const resolve = async () => {
          const segments = path.split('.')
          let current: any = caller
          for (const segment of segments) {
            current = current[segment]
          }
          return await current(input)
        }

        resolve()
          .then(result => {
            observer.next({ result: { data: result } })
            observer.complete()
          })
          .catch(err => {
            observer.error(err)
          })
      })
    }
  }
}
