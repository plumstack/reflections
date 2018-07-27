/* eslint-disable */
const chai = require('chai');
const axios = require('axios');

const expect = chai.expect;

describe('restrict unauthorized access to API', function() {
  describe('/api/auth/checkAuth', function() {
    let result;
    before('get results from endpoint', async function() {
      return new Promise(function(res, rej) {
        const options = {
          method: 'GET',
          url: 'http://localhost:8085/api/auth/checkAuth',
        };
        axios(options)
          .then((response) => {
            result = response.data;
            res(result);
          })
          .catch(rej);
      });
    });
    it('should return JSON with a loggedIn property', async function() {
      expect(result).to.have.property('loggedIn');
    });
    it('loggedIn property should be false', function() {
      expect(result.loggedIn).to.equal(false);
    });
  });
});
