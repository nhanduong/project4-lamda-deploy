import jsonwebtoken from 'jsonwebtoken'
import { JwksClient } from 'jwks-rsa'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')
const jwksUrl = 'https://dev-d1edgpzrydjvjwin.us.auth0.com/.well-known/jwks.json'
const jwks = new JwksClient({ jwksUri: jwksUrl })

export async function handler(event) {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return generatePolicyDocument(jwtToken.sub, 'Allow')
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return generatePolicyDocument('user', 'Deny')
  }
}

async function verifyToken(authHeader) {
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })

  const signingKey = await jwks.getSigningKey(jwt.header.kid)
  const publicKey = signingKey.publicKey || signingKey.rsaPublicKey

  return jsonwebtoken.verify(token, publicKey, { complete: false })
}

function getToken(authHeader) {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer ')) {
    throw new Error('Invalid authentication header')
  }

  return authHeader.split(' ')[1]
}

function generatePolicyDocument(principalId, effect) {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: '*'
        }
      ]
    }
  }
}
