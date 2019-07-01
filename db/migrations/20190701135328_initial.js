
exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('projects', (table) => {
      table.increments('id').primary();
      table.string('project_name');

      table.timestamps(true, true);
    }),

    knex.schema.createTable('palettes', (table) => {
      table.increments('id').primary();
      table.string('palette_name');
      table.string('color1');
      table.string('color2');
      table.string('color3');
      table.string('color4');
      table.string('color5');
      table.integer('project_id').unsigned()
      table.foreign('project_id')
        .references('projects.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      
      table.timestamps(true, true);
    })
  ]);
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('projects'),
    knex.schema.dropTable('palettes')
  ]);
};
