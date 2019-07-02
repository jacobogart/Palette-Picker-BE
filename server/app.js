const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const environment = process.env.NODE_ENV || "development";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);

app.use(bodyParser.json());

const paletteParamChecker = (palette, res) => {
  let hasAllParams = true;
  const requiredParameters = [
    "palette_name",
    "color1",
    "color2",
    "color3",
    "color4",
    "color5",
    "project_id"
  ];

  for (let requiredParameter of requiredParameters) {
    if (!palette[requiredParameter]) {
      hasAllParams = false;
      return res.status(422).json({
        error: `Palette was not added. Please include ${requiredParameter}`
      });
    }
  }
  return hasAllParams;
};

app.get("/", (req, res) => {
  res.status(200).json({message: 'Palette Picker BE'});
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
  const { id } = req.params;
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
  const { id } = req.params;
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

app.post("/api/v1/projects", (req, res) => {
  const { project_name } = req.body;
  if (!project_name) {
    res.status(422).json({
      error: `Project was not created. Please include a project name`
    });
  } else {
    database("projects")
      .insert({ project_name }, "id")
      .then(id => {
        res.status(201).json({ id: id[0] });
      })
      .catch(error => {
        res.status(500).json({ error });
      });
  }
});

app.post("/api/v1/palettes", (req, res) => {
  const newPalette = req.body;
  if (paletteParamChecker(newPalette, res)) {
    database("palettes")
      .insert(newPalette, "id")
      .then(newID => {
        res.status(201).json({ id: newID[0] });
      })
      .catch(error => {
        if (error.code === "23503") {
          res
            .status(404)
            .json({ error: `No project found with id of ${newPalette.project_id}` });
        } else {
          res.status(500).json({ error });
        }
      });
  }
});

app.put("/api/v1/projects/:id", (req, res) => {
  const { project_name } = req.body;
  const { id } = req.params;
  if (!project_name) {
    res.status(422).json({
      error: `Project was not updated. Please include a project name`
    });
  } else {
    database("projects")
      .where({ id })
      .update({ project_name })
      .then(result => {
        if (!result) {
          res.status(404).json({ error: `No project found with id of ${id}` });
        } else {
          res.status(204).send();
        }
      })
      .catch(error => {
        res.status(500).json({ error });
      });
  }
});

app.put("/api/v1/palettes/:id", (req, res) => {
  const palette = req.body;
  const { id } = req.params;
  if (paletteParamChecker(palette, res)) {
    database("palettes")
      .where({ id })
      .update({ ...palette })
      .then(result => {
        if (!result) {
          res
            .status(404)
            .json({ error: `No palette was found with id of ${id}` });
        } else {
          res.status(204).send();
        }
      })
      .catch(error => {
        res.status(500).json({ error });
      });
  }
});

app.delete("/api/v1/projects/:id", (req, res) => {
  const { id } = req.params;
  database("projects")
    .where({ id })
    .del()
    .then(result => {
      if (result) {
        res.status(204).send();
      } else {
        res.status(404).json({
          error: `Nothing was deleted. Unable to find project with id of ${id}.`
        });
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

app.delete("/api/v1/palettes/:id", (req, res) => {
  const { id } = req.params;
  database("palettes")
    .where({ id })
    .del()
    .then(result => {
      if (result) {
        res.status(204).send();
      } else {
        res.status(404).json({
          error: `Nothing was deleted. Unable to find palette with id of ${id}.`
        });
      }
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

module.exports = app;
