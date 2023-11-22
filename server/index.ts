import express, { Request, Response } from 'express'
import bp from 'body-parser'
import dotenv from 'dotenv/config'
import cors from 'cors'

const app = express()
const port = 5000

dotenv
app.use(cors())
app.use(bp.json())
app.use(bp.urlencoded({extended: true}))

app.post('/sign-up', (req: Request, res: Response) => {
})

app.listen(port, () => {
  console.log('Listen on port: ', 5000, ' blya')
})