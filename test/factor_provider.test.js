'use strict';

const expect = require('chai').expect;
const stubs = require('./stubs');
const data = require('./data');
const factorProvider = require('../').configure({
  client: {
    region: 'us',
    token: data.token,
    tenant: data.tenant
  }
}).factorProvider;

describe('factorProvider', function() {

  describe('.fetch', function() {

    describe('success', function() {

      beforeEach(function() {
        stubs.stub({ tenant: data.tenant, region: 'us' })
          .get('/guardian/factors/sms/providers/twilio')
          .reply(200, data.factorProvider);
      });

      it('fetchs data', function() {
        return expect(factorProvider.create({ factor: 'sms', provider: 'twilio' })
          .fetch())
          .to.be.eventually.fulfilled
          .then(function(fp) {
            expect(fp.attrs()).to.eql(data.factorProvider)
          });
      });
    });

    describe('failure', function() {

      beforeEach(function() {
        stubs.stub({ tenant: data.tenant, region: 'us' })
          .get('/guardian/factors/sms/providers/twilio')
          .reply(400, { error: true });
      });

      it('returns error', function() {
        return expect(factorProvider.create({ factor: 'sms', provider: 'twilio' })
          .fetch())
          .to.be.eventually.rejected
          .then(function(err) {
            expect(err).to.be.an.instanceOf(Error);
            expect(err.data).to.eql({ error: true });
          });
      });
    });
  });

  describe('#update', function() {
    const expected = Object.assign({}, data.factorProvider, { sid: '456' });

    describe('success', function() {

      beforeEach(function() {
        stubs.stub({ tenant: data.tenant, region: 'us' })
          .put('/guardian/factors/sms/providers/twilio')
          .reply(200, expected);
      });

      it('updates data', function() {
        const f = factorProvider.create({ factor: 'sms', provider: 'twilio' }, data.factorProvider);

        return expect(f.set({ sid: '456' }).update()).to.be.eventually.fulfilled
          .then(function(factor) {
            expect(factor.changes).to.eql({});
            expect(factor.data).to.eql(expected);
            expect(factor.attrs()).to.have.property('sid', '456');
          });
      });
    });

    describe('failure', function() {

      beforeEach(function() {
        stubs.stub({ tenant: data.tenant, region: 'us' })
          .put('/guardian/factors/sms/providers/twilio')
          .reply(400, { r: '123' });
      });

      it('returns error', function() {
         const f = factorProvider.create({ factor: 'sms', provider: 'twilio' }, data.factorProvider);

         return expect(f.set({ sid: '456' }).update())
          .to.be.eventually.rejected
          .then(function(err) {
            expect(err).to.be.an.instanceOf(Error);
            expect(err.data).to.eql({ r: '123' });
            expect(f.changes).to.eql({ sid: '456' });
            expect(f.data).to.eql(data.factorProvider);
          });
      });
    });
  });
});
