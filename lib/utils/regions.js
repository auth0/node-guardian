'use strict';

const domains = {
  'us': '{tenant}.auth0.com',
  'eu': '{tenant}.eu.auth0.com',
  'au': '{tenant}.au.auth0.com',
  'local': '{tenant}.myauth0.com'
};

exports.getDomain = function(name) {
  return domains[name];
};
