import { DynameDb } from '@commons/dynamodb.class';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

/**
 * @description returns all or some result depending on query params. Uses getAllRecords function of dynamodb
 * @param {APIGatewayEvent} event with empty of non empty querypathParameters including tags and limit query
 * @returns response of 200 or 404 or 500 with record or error respectively
 */
const getPets: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    let response = await new DynameDb(
      process.env.IS_OFFLINE,
      'pets'
    ).getAllRecords(event.queryStringParameters);
    if (response.items && response.Items.length == 0) {
      return formatJSONResponse(
        {
          response,
        },
        404
      );
    } else {
      return formatJSONResponse(
        {
          response,
        },
        200
      );
    }
  } catch (e) {
    return formatJSONResponse(
      {
        Error: e,
      },
      500
    );
  }
};

export const main = middyfy(getPets);
