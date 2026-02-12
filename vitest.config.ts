import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['mobile/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': '.',
    },
  },
})
