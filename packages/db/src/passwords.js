import crypto from 'crypto'

export function randomPassword() {
  return crypto.randomBytes(20).toString('base64').slice(0, 20)
}

/**
 * Generates a salted hash for a given password.
 *
 * @param {string} password
 * @returns
 */
export async function hash(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex')
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err)
      resolve(salt + ':' + derivedKey.toString('hex'))
    })
  })
}

/**
 * Checks if a password matches a given hash.
 *
 * @param {string} password
 * @param {string} hash
 * @returns
 */
export async function verify(password, hash) {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(':')
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err)
      resolve(key === derivedKey.toString('hex'))
    })
  })
}

export default {
  randomPassword,
  hash,
  verify,
}
