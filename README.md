# eb-blue-green

Utilities for handling blue green deployments in elastic beanstalk environments.

## Configuration

You will want some environment variables set for local use:

```
export AWS_PROFILE=teamgantt
export AWS_REGION=us-east-2
export NODE_ENV=development
```

If running in an AWS environment, you don't really need to worry about anything.

Local use assumes it will be reading profile information from `~/.aws/credentials` based off the `AWS_PROFILE` environment variable and the `AWS_REGION` environment variable.

There is `.envrc` in the repo if you are into using [direnv](https://direnv.net/). Just update the values with your own profile/region.

## Usage

These are mostly functions that sit on top of the aws sdk for JavaScript.

Since beanstalk environment names have to be unique for a region within an account, most of these functions operate from that starting point.

The main functions of interest are `cloneEnvironment`, `swapUrls`, and `terminateEnvironment`.


```js
const eb = require('@teamgantt/eb-blue-green');

(async function() {

// clone the blue environment to a new env called "green"
await eb.cloneEnvironment('blue', 'green');

// swap the blue and green cnames - i.e direct traffic to green
const from = 'blue';
const to = 'green';
await eb.swapUrls(from, to);

// when you are done deploying and testing blue, swap things back and clean up
await eb.swapUrls(to, from);
await eb.terminateEnvironment('green');

})();

```
