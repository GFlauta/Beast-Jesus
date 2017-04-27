exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('user').del()
    .then(function () {
      // Inserts seed entries
      return knex('user').insert([{
        id: 1,
        first_name: 'admin',
        last_name: 'admin',
        email: 'admin@admin.com',
        username: 'admin',
        password: '$2a$10$m.OTXOed3s5q.EC5lWIXZONPAzXYlX64cl51q9vdAGXVbstIUXG9y',
        isAdmin: true,
      }]);
    });
}; 