import type { AWS } from '@serverless/typescript';

import { addPet, deletePet, getPetById, getPets } from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'serverless-eval',
  frameworkVersion: '2',
  custom: {
    dynamodb: {
      stages: ['dev'],
      region: 'us-east-1',
      start: {
        port: 8000,
        migrate: true,
        inMemory: true,
        seed: true,
      },
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
    },
  },
  plugins: [
    'serverless-esbuild',
    'serverless-offline',
    'serverless-dynamodb-local',
  ],
  provider: {
    name: 'aws',
    region: 'us-east-1',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      AWS_ACCOUNT_ID: '218767131295',
      PET_TABLE: 'pets',
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['dynamodb:*'],
        Resource:
          'arn:aws:dynamodb:${self:provider.region}:${self:provider.environment.AWS_ACCOUNT_ID}:table/${self:provider.environment.PET_TABLE}',
      },
    ],
  },
  // import the function via paths
  functions: { addPet, deletePet, getPetById, getPets },
  resources: {
    Resources: {
      pets: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'pets',
          BillingMode: 'PAY_PER_REQUEST',
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH',
            },
          ],
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
