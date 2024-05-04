import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const jwksUrl = 'https://test-endpoint.auth0.com/.well-known/jwks.json'

const certificate = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJEEW0GkQDlOvQMA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi1xMjFrZnJ4c2Z1b3FiNzY0LnVzLmF1dGgwLmNvbTAeFw0yNDA1MDEw
OTI1MjNaFw0zODAxMDgwOTI1MjNaMCwxKjAoBgNVBAMTIWRldi1xMjFrZnJ4c2Z1
b3FiNzY0LnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAI/mXBvOgm1LzoPn9hwaULhWpxXM5L181VChvy1ch2qBSPl+r99zHR+nDpBd
PbL+0zs2Fi/k/wSV1a5R8g5dfOgG30iafLOaG03+Sb235cMrAFh0a991t0RZH33X
5ReozKho0nCOuNjydh7eNgHmoWKkiAKGEOb/s36rLjBmOnEqHJTYPHw3ERFUCaiP
5wNeTMMiHoBZbYehhWNkoImL9+xRmPtE7K9dCsRPCZnv/Y/r6LJYsxJ8xwuUC9fk
tC+36KZFCEKEJpBK2H6F9WNsjt05MqBdtqceD6fdmBktwWPLPIzRrAUDwchtye1U
hb8AGqlYpHxDxD0CqxUurNJSvZ8CAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQUFS3fevR1998Ie+oCZahXUlZkf5EwDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQBdAi6eZqniyGKeu014Icdw4/rx4I5me3GiJhhaUGRa
eUtOtq/btYHKG0X+FAw8XCvy720nmdKRkr6K/26k+SwqkVilga8od1Xsv2x9Z8c5
srFWz9Ucqsiy5cpv29dXCCdvZ8trl9H61GdE3SO+iHQs1ye/PZn50RQTAXOgvU6d
tu3H4VavgH3pDJS8bbvIHatJaurM+fjvilc4mqS+hC3IyjL1Zh5lnc5Cyg/goAAD
hNotrfd1FxRKr+qly1qZiNGj9wOvGLsN+XbzWA432VxS58ynwp1GFrV69/6B7AO+
Kseyhpw+/Ed+RPjZR6+9ciTuM8pRR/hGIJrjMLUmhcYr
-----END CERTIFICATE-----`

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader) {

  const token = getToken(authHeader)
  // console.log("token: ", token)

  const jwt = jsonwebtoken.decode(token, { complete: true })
  const check = jsonwebtoken.verify(token, certificate, { algorithms: ['RS256'] })
  // TODO: Implement token verification
  return check;

}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')
  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
