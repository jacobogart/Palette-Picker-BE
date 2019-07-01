const express = require("express");
const app = express();
const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("HELLOO");
});

app.get("/api/v1/projects", (req, res) => {
  database("projects")
    .select()
    .then(projects => {
      res.status(200).json(projects);
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

app.get("/api/v1/palettes", (req, res) => {
  database("palettes")
    .select()
    .then(palettes => {
      res.status(200).json(palettes);
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

app.get("/api/v1/projects/:id", (req, res) => {
  const { id } = req.param;
  database("projects")
    .where({ id })
    .select()
    .then(project => {
      if (project.length) {
        res.status(200).json(project[0]);
      } else {
        res.status(404).json({ error: `No project found with id of ${id}` });
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

app.get("/api/v1/palettes/:id", (req, res) => {
  const { id } = req.param;
  database("palettes")
    .where({ id })
    .select()
    .then(palette => {
      if (palette.length) {
        res.status(200).json(palette[0]);
      } else {
        res.status(404).json({ error: `No palette found with id of ${id}` });
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

app.post('/api/v1/projects', (req, res) => {
  const project_name = req.body.name;
  if(!project_name) {
    res.status(422).json({error: `Project was not created. Please include a project name`})
  } else {
    database('projects').insert({project_name}, 'id')
      .then(id => {
        res.status(201).json({id: id[0]})
      })
      .catch(error => {
        res.status(500).json({ error });
      })
  }
});

app.post('/api/v1/palettes', (req, res)=> {
  const newPalette = req.body;
  const requiredParameters = ['palette_name', 'color1', 'color2', 'color3', 'color4', 'color5', 'project_id'];

  for(let requiredParameter of requiredParameters) {
    if (!newPalette[requiredParameter]) {
      res.status(422).json({ error: `Palette was not added. Please include a ${requiredParameter}`})
    }
  }
  database('projects').where({ id: newPalette.project_id}).select('id')
  .then(projectID => {
    if(!projectID) {
      res.status(404).json({error: `No project found with id of ${projectID}`});
    } else {
      database('palettes').insert(newPalette, 'id')
      .then(newID => {
        res.status(201).json({ id: newID[0] })
      })
      .catch(error => {
        res.status(500).json({ error });
      })
    }
  })
  .catch(error => {
    res.status(500).json({ error });
  })

})

module.exports = app;
