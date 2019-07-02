const request = require('supertest');
const app = require('./app.js');
const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

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
});