function describeApplications(client, names = []) {
  return client.describeApplications({ApplicationNames: names}).promise();
}

function describeEnvironments(client, names = []) {
  return client.describeEnvironments({EnvironmentNames: names}).promise();
}

async function getEnvironment(client, environmentName) {
  const {Environments: [env]} = await describeEnvironments(client, [environmentName]);
  return env;
}

async function getApplication(client, applicationName) {
  const {Applications: [app]} = await describeApplications(client, [applicationName]);
  return app;
}

async function getConfigurationTemplate(client, environment) {
  const {ApplicationName} = environment;
  const application = await getApplication(client, ApplicationName);
  return application.ConfigurationTemplates[0];
}

async function cloneEnvironment(client, environmentName, cloneName) {
  const env = await getEnvironment(client, environmentName);
  const templateName = await getConfigurationTemplate(client, env);
  return client.createEnvironment({
    ApplicationName: env.ApplicationName,
    EnvironmentName: cloneName,
    TemplateName: templateName,
    VersionLabel: env.VersionLabel
  }).promise();
}

function swapUrls(client, sourceEnvironmentName, destinationEnvironmentName) {
  return client.swapEnvironmentCNAMEs({
    DestinationEnvironmentName: destinationEnvironmentName,
    SourceEnvironmentName: sourceEnvironmentName
  }).promise();
}

function terminateEnvironment(client, environmentName) {
  return client.terminateEnvironment({EnvironmentName: environmentName}).promise();
}

module.exports = {
  describeApplications,
  describeEnvironments,
  getEnvironment,
  getConfigurationTemplate,
  cloneEnvironment,
  swapUrls,
  terminateEnvironment
};
