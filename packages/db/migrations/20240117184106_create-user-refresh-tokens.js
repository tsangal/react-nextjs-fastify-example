export function up(knex) {
  return knex.schema.createTable('user_refresh_tokens', (table) => {
    table.uuid('id').primary()
    table
      .uuid('user_id')
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE')
      .notNullable()
      .index()
    table.datetime('expiry_date').notNullable()
    table.timestamps(true, true)
  })
}

export function down(knex) {
  return knex.schema.dropTableIfExists('user_refresh_tokens')
}
