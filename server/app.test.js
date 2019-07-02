const request = require('supertest');
const app = require('./app.js');
const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
const randomHexColor = require("random-hex-color");

describe('Server', () => {
  beforeEach(async () => {
    await database.seed.run();
  });

  describe('init', () => {
    it('should return a 200 status', async () => {
      const res = await request(app).get('/');
      const { message } = res.body;
      expect(res.status).toEqual(200);
      expect(message).toEqual('Palette Picker BE');
    });
  });

  describe('GET /projects', () => {
    it('should return all the projects in the DB', async () => {
      const expectedProjects = await database('projects').select();

      const res = await request(app).get('/api/v1/projects');
      const projects = res.body;

      expect(projects.length).toEqual(expectedProjects.length);
    });
  });

  describe('GET /palettes', () => {
    it("should return all the palettes in the DB", async () => {
      const expectedPalettes = await database("palettes").select();

      const res = await request(app).get("/api/v1/palettes");
      const palettes = res.body;

      expect(palettes.length).toEqual(expectedPalettes.length);
    });
  });

  describe('GET /projects/:id', () => {
    it.skip('should return a single project from the DB', async () => {
      const project = await database('projects').first();
      const { id } = project;

      const res = await request(app).get(`/api/v1/projects/${id}`);

      expect(res.body).toEqual(project);
    });
  });

  describe("GET /palettes/:id", () => {
    it.skip("should return a single palette from the DB", async () => {
      const palette = await database("palettes").first();
      const { id } = palette;

      const res = await request(app).get(`/api/v1/palettes/${id}`);

      expect(res.body).toEqual(palette);
    });
  });

  describe('POST /projects', () => {
    it('should add a new project to the DB', async () => {
      const newProject = { project_name: 'My New Project' };
      const res = await request(app).post('/api/v1/projects').send(newProject);
      const { id } = res.body;
      const project = await database('projects').where({ id }).first();

      expect(res.status).toEqual(201);
      expect(project.project_name).toEqual(newProject.project_name);
    });
  });

  describe('POST /palettes', () => {
    it('should add a new palette to the DB', async () => {
      const { id } = await database('projects').first().select('id');
      const newPalette = {
        palette_name: "My New Palette",
        color1: randomHexColor(),
        color2: randomHexColor(),
        color3: randomHexColor(),
        color4: randomHexColor(),
        color5: randomHexColor(),
        project_id: id
      };

      const res = await request(app).post('/api/v1/palettes').send(newPalette);
      const newId = res.body.id;
      const palette = await database('palettes').where({ id: newId }).first();
      
      expect(res.status).toEqual(201);
      expect(palette.palette_name).toEqual(newPalette.palette_name);
    });
  });

  
});