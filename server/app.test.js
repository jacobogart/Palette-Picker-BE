const request = require("supertest");
const app = require("./app.js");
const environment = process.env.NODE_ENV || "test";
const configuration = require("../knexfile")[environment];
const database = require("knex")(configuration);
const randomHexColor = require("random-hex-color");

describe("Server", () => {
  beforeEach(async () => {
    await database.seed.run();
  });

  describe("init", () => {
    it("should return a 200 status", async () => {
      const res = await request(app).get("/");
      const { message } = res.body;

      expect(res.status).toEqual(200);
      expect(message).toEqual("Palette Picker BE");
    });
  });

  describe("GET /projects", () => {
    it("should return all the projects in the DB", async () => {
      const expectedProjects = await database("projects").select();

      const res = await request(app).get("/api/v1/projects");
      const projects = res.body;

      expect(res.status).toEqual(200);
      expect(projects.length).toEqual(expectedProjects.length);
    });
  });

  describe("GET /palettes", () => {
    it("should return all the palettes in the DB", async () => {
      const expectedPalettes = await database("palettes").select();

      const res = await request(app).get("/api/v1/palettes");
      const palettes = res.body;

      expect(res.status).toEqual(200);
      expect(palettes.length).toEqual(expectedPalettes.length);
    });
  });

  describe("GET /projects/:id", () => {
    it("should return a single project from the DB", async () => {
      const project = await database("projects").first();
      const { id } = project;

      const res = await request(app).get(`/api/v1/projects/${id}`);

      expect(res.status).toEqual(200);
      expect(res.body.palette_name).toEqual(project.palette_name);
    });

    it("should return a status code of 404 if unable to find a project with the matching id", async () => {
      const response = await request(app).get("/api/v1/projects/0");
      expect(response.status).toBe(404);
      expect(response.body.error).toEqual("No project found with id of 0");
    });
  });

  describe("GET /palettes/:id", () => {
    it("should return a single palette from the DB", async () => {
      const palette = await database("palettes").first();
      const { id } = palette;

      const res = await request(app).get(`/api/v1/palettes/${id}`);

      expect(res.status).toEqual(200);
      expect(res.body.project_name).toEqual(palette.project_name);
    });

    it("should return a status code of 404 if unable to find a palette with the matching id", async () => {
      const response = await request(app).get("/api/v1/palettes/0");
      expect(response.status).toBe(404);
      expect(response.body.error).toEqual("No palette found with id of 0");
    });
  });

  describe("POST /projects", () => {
    it("should add a new project to the DB", async () => {
      const newProject = { project_name: "My New Project" };
      const res = await request(app)
        .post("/api/v1/projects")
        .send(newProject);
      const { id } = res.body;
      const project = await database("projects")
        .where({ id })
        .first();

      expect(res.status).toEqual(201);
      expect(project.project_name).toEqual(newProject.project_name);
    });

    it("should return a status code of 422 if unable to post the project", async () => {
      const res = await request(app).post("/api/v1/projects").send({});
      expect(res.status).toEqual(422)
      expect(res.body.error).toEqual("Project was not created. Please include a project name")
    });
  });

  describe("POST /palettes", () => {
    it("should add a new palette to the DB", async () => {
      const { id } = await database("projects")
        .first()
        .select("id");
      const newPalette = {
        palette_name: "My New Palette",
        color1: randomHexColor(),
        color2: randomHexColor(),
        color3: randomHexColor(),
        color4: randomHexColor(),
        color5: randomHexColor(),
        project_id: id
      };

      const res = await request(app)
        .post("/api/v1/palettes")
        .send(newPalette);
      const newId = res.body.id;
      const palette = await database("palettes")
        .where({ id: newId })
        .first();

      expect(res.status).toEqual(201);
      expect(palette.palette_name).toEqual(newPalette.palette_name);
    });


    it("should return a status code of 422 if unable to post the palette with missing parameters", async () => {
      const res = await request(app).post("/api/v1/palettes").send({});
      expect(res.status).toEqual(422)
      expect(res.body.error).toEqual("Palette was not added. Please include palette_name")
    });
    
    it("should return a status code of 404 if no project with that id", async () => {
      const mockPalette = {
        palette_name: "My New Palette",
        color1: randomHexColor(),
        color2: randomHexColor(),
        color3: randomHexColor(),
        color4: randomHexColor(),
        color5: randomHexColor(),
        project_id: 1
      };

      const res = await request(app).post("/api/v1/palettes").send(mockPalette);
      expect(res.status).toEqual(404);
      expect(res.body.error).toEqual("No project found with id of 1");
    });

  });

  describe("PUT /projects/:id", () => {
    it("should update the appropriate entry in the DB", async () => {
      const projectToUpdate = await database("projects").first();
      projectToUpdate.project_name = "My Updated Project";
      const { id } = projectToUpdate;
      const res = await request(app)
        .put(`/api/v1/projects/${id}`)
        .send(projectToUpdate);

      const project = await database("projects")
        .where({ id })
        .first();

      expect(res.status).toEqual(204);
      expect(project.project_name).toEqual(projectToUpdate.project_name);
    });
  });

  describe("PUT /palettes/:id", () => {
    it("should update the appropriate entry in the DB", async () => {
      const paletteToUpdate = await database("palettes").first();
      paletteToUpdate.palette_name = "My Updated Palette";
      const { id } = paletteToUpdate;
      const res = await request(app)
        .put(`/api/v1/palettes/${id}`)
        .send(paletteToUpdate);

      const palette = await database("palettes")
        .where({ id })
        .first();

      expect(res.status).toEqual(204);
      expect(palette.palette_name).toEqual(paletteToUpdate.palette_name);
    });
  });

  describe("DELETE /projects/:id", () => {
    it("should delete the appropriate project", async () => {
      const projectToDelete = await database("projects").first();
      const { id } = projectToDelete;

      const res = await request(app).delete(`/api/v1/projects/${id}`);
      const deletedProject = await database("projects")
        .where({ id })
        .first();

      expect(res.status).toEqual(204);
      expect(deletedProject).toEqual(undefined);
    });

    it("should delete the associated palettes", async () => {
      const projectToDelete = await database("projects").first();
      const { id } = projectToDelete;

      await request(app).delete(`/api/v1/projects/${id}`);

      const projectPalettes = await database("palettes")
        .where({ project_id: id })
        .select();

      expect(projectPalettes.length).toEqual(0);
    });
  });

  describe("DELETE /palettes/:id", () => {
    it("should delete the appropriate palette", async () => {
      const paletteToDelete = await database("palettes").first();
      const { id } = paletteToDelete;

      const res = await request(app).delete(`/api/v1/palettes/${id}`);
      const deletedPalette = await database("palettes")
        .where({ id })
        .first();

      expect(res.status).toEqual(204);
      expect(deletedPalette).toEqual(undefined);
    });
  });
});
