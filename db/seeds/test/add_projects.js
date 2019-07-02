const randomHexColor = require("random-hex-color");

const projects = [
  { project_name: "My First Project" },
  { project_name: "My Second Project" }
];

const palettes = [
  {
    palette_name: "My First Palette",
    color1: randomHexColor(),
    color2: randomHexColor(),
    color3: randomHexColor(),
    color4: randomHexColor(),
    color5: randomHexColor()
  },
  {
    palette_name: "My Second Palette",
    color1: randomHexColor(),
    color2: randomHexColor(),
    color3: randomHexColor(),
    color4: randomHexColor(),
    color5: randomHexColor()
  }
];

const createPalette = (knex, palette, id) => {
  return knex("palettes").insert({ ...palette, project_id: id });
};

const createProject = (knex, project) => {
  return knex("projects")
    .insert(project, "id")
    .then(id => {
      let palettePromises = [];
      palettes.forEach(palette => {
        palettePromises.push(createPalette(knex, palette, id[0]));
      });
      return Promise.all(palettePromises);
    })
    .catch(error => console.log(`Error seeding palettes ${error}`));
};

exports.seed = function(knex) {
  return knex("palettes")
    .del()
    .then(() => knex("projects").del())
    .then(() => {
      let projectPromises = [];
      projects.forEach(project => {
        projectPromises.push(createProject(knex, project));
      });
      return Promise.all(projectPromises);
    })
    .catch(error => console.log(`Error seeding projects ${error}`));
};
