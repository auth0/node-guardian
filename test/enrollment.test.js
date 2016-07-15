'use strict';

const expect = require('chai').expect;
const stubs = require('./stubs');
const data = require('./data');
const enrollment = require('../').configure({
    client: {
      region: 'us',
      token: data.token,
      tenant: data.tenant
    }
  }).enrollment;

describe('enrollment', function() {

  describe('#fetch', function() {

    describe('success', function() {

      beforeEach(function() {
        stubs.stub({ tenant: data.tenant, region: 'us' })
          .get('/guardian/enrollments/' + data.enrollment.id)
          .reply(200, data.enrollment);
      });

      it('fetchs data', function() {
        return expect(enrollment.create(data.enrollment.id).fetch())
          .to.be.eventually.fulfilled
          .then(function(enrollment) {
            expect(enrollment.attrs()).to.eql(data.enrollment);
          });
      });
    });

    describe('failure', function() {

      beforeEach(function() {
        stubs.stub({ tenant: data.tenant, region: 'us' })
          .get('/guardian/enrollments/' + data.enrollment.id)
          .reply(400, data.enrollment);
      });

      it('returns error', function() {
        return expect(enrollment.create(data.enrollment.id).fetch())
          .to.be.eventually.rejected
          .then(function(err) {
            expect(err).to.be.an.instanceOf(Error);
          });
      });
    });
  });

  describe('#del', function() {

    describe('success', function() {
      beforeEach(function() {
        stubs.stub({ tenant: data.tenant, region: 'us' })
          .delete('/guardian/enrollments/' + data.enrollment.id)
          .reply(204, '');
      });

      it('deletes enrollment', function() {
        return expect(enrollment.create(data.enrollment.id).del()).to.be.eventually.resolved;
      });
    });

    describe('failure', function() {

      it('returns error', function() {
        return expect(enrollment.create(data.enrollment.id).del())
          .to.be.eventually.rejected
          .then(function(err) {
            expect(err).to.be.an.instanceOf(Error);
          });
      });
    });
  });
});
