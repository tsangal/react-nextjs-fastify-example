import { v4 as uuidv4 } from 'uuid'
import passwords from '../src/passwords.js'

export async function seed(knex) {
  const seedUsers = [
    {
      username: 'admin@localhost',
      password: 'admin',
      name: 'Admin',
    },
    {
      username: 'test@localhost',
      password: 'test',
      name: 'Test',
    },
  ]

  for (const seedUser of seedUsers) {
    seedUser.id = uuidv4()
    seedUser.password = await passwords.hash(seedUser.password)
  }

  return knex('users').insert(seedUsers).onConflict('username').ignore()
}
