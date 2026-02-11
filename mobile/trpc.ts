import { router } from '@/mobile/api'
import { createTRPCReact } from '@trpc/react-query'

export const trpc = createTRPCReact<typeof router>()
