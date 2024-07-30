import * as swaggerui from 'swagger-ui-express'
import oas from '../docs/openapi/openapi.json' assert { type: 'json' }
import express from 'express'

const app = express()

app.use(swaggerui.serve)
app.get('/api', swaggerui.setup(oas))

app.listen(8654, () => {
  console.log(
    'Servidor de documentação online!\nAcesse em:  http://localhost:8654/api',
  )
})
