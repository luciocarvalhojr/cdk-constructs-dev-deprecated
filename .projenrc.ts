import { awscdk } from 'projen';

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'tm-lcarvalho',
  authorAddress: 'lucio.carvalho@toumoro.com',
  cdkVersion: '2.143.0',
  defaultReleaseBranch: 'main',
  jsiiVersion: '~5.2.0',
  name: 'tm-cdk-constructs',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/tm-lcarvalho/cdk-constructs.git',
  description: 'A CDK construct library',
  license: 'GPL-3.0-or-later',
  gitignore: ['.venv', '.env', 'package-lock.json'],
  npmignore: ['examples'],
  devDeps: [
    'cdk',
  ],

  deps: ['cdk-nag'], /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
  npmProvenance: false,
  publishToPypi: {
    distName: 'tm-cdk-constructs',
    module: 'tm-cdk-constructs',
  },
  majorVersion: 1,
  stability: 'experimental',
});

project.synth();