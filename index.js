const AWS = require('aws-sdk');
const environment = require('./lib/environment');

// Configure The SDK for the appropriate environment

(function configure() {
  if (process.env.NODE_ENV === 'development') {
    // console.log('Configuring environment for development');
    // read from ~/.aws/credentials
    AWS.config.credentials = new AWS.SharedIniFileCredentials();
  } else {
    // console.log('Configuring environment for production');
    // production should be pulling from IAM
  }
})();

const client = new AWS.ElasticBeanstalk();

/**
 * Partially applies a configured AWS client to the functions exported
 * from a module
 * 
 * @param {AWS.ElasticBeanstalk} client 
 * @param {Object} mod - the module to apply the client to
 */
const applyClient = (client, mod) => {
  const fns = Object.keys(mod);
  return fns.reduce((acc, fn) => {
    acc[fn] = (...args) => mod[fn](client, ...args);
    return acc;
  }, {});
};

/**
 * Export the environment module with a beanstalk client partially applied
 */
module.exports = applyClient(client, environment);
