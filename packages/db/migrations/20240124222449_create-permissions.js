export async function up(knex) {
  await knex.schema.createTable('permissions', (table) => {
    table.uuid('id').primary()
    table.string('name', 100).notNullable().unique()
    table.string('description', 200)
    table.timestamps(true, true)
  })
}

export function down(knex) {
  return knex.schema.dropTableIfExists('permissions')
}
