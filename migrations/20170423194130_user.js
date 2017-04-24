
exports.up = function(knex, Promise) {
  return knex.schema.createTable('user', function(table){
      table.increments();
      table.string('name').notNullable();
      table.string('email').notNullable().unique();
      table.string('username').notNullable().unique();
      table.string('password').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('user');
};
