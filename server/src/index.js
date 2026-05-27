import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { app } from './app.js'

// Try loading project root .env first so running from /server picks up root vars
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootEnv = path.resolve(__dirname, '..', '..', '.env')
if (fs.existsSync(rootEnv)) {
  dotenv.config({ path: rootEnv })
  console.log(`Loaded env from ${rootEnv}`)
} else {
  dotenv.config()
  console.log('Loaded env from default .env (cwd)')
}

const port = process.env.PORT || 4000
const server = app.listen(port, () => {
  console.log(`@focusflow/server running on http://localhost:${port}`)
})

export { server }
