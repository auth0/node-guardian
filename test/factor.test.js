'use strict';

const expect = require('chai').expect;
const stubs = require('./stubs');
const data = require('./data');
const factor = require('../').configure({
  region: 'us',
  token: data.token,
  tenant: data.tenant
}).factor;

describe('factor', function() {

  describe('.getAll', function() {

    describe('success', function() {

      beforeEach(function() {
        stubs.stub({ tenant: data.tenant, region: 'us' })
          .get('/guardian/factors')
          .reply(200, [ data.factor ]);
      });

      it('fetchs data', function() {
        return factor.getAll().then(function(factors) {
          factors.forEach((f) => expect(f.attrs()).to.eql(data.factor))
        });
      });
    });

    describe('failure', function() {

      beforeEach(function() {
        stubs.stub({ tenant: data.tenant, region: 'us' })
          .get('/guardian/factors')
          .reply(400, { error: true });
      });

      it('returns error', function() {
        return expect(factor.getAll())
          .to.be.eventually.rejected
          .then(function(err) {
            expect(err).to.be.an.instanceOf(Error);
            expect(err.data).to.eql({ error: true });
          });
      });
    });
  });

  describe('#update', function() {
    const expected = Object.assign({}, data.factor, { enabled: true });

    describe('success', function() {

      beforeEach(function() {
        stubs.stub({ tenant: data.tenant, region: 'us' })
          .put('/guardian/factors/' + data.factor.name)
          .reply(200, expected);
      });

      it('updates data', function() {
        const f = factor.create(data.factor.name, data.factor);

        return expect(f.enable().update())
          .to.be.eventually.fulfilled
          .then(function(factor) {
            expect(f.changes).to.eql({});
            expect(f.data).to.eql(expected);
            expect(f.attrs()).to.have.property('enabled', true);
          });
      });
    });

    describe('failure', function() {

      beforeEach(function() {
        stubs.stub({ tenant: data.tenant, region: 'us' })
          .put('/guardian/factors/' + data.factor.name)
          .reply(400, { r: '123' });
      });

      it('returns error', function() {
         const f = factor.create(data.factor.name, data.factor);

         return expect(f.enable().update())
          .to.be.eventually.rejected
          .then(function(err) {
            expect(err).to.be.an.instanceOf(Error);
            expect(err.data).to.eql({ r: '123' });
            expect(f.changes).to.eql({ enabled: true });
            expect(f.data).to.eql(data.factor);
          });
      });
    });
  });
});
