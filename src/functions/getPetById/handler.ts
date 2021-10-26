import { DynameDb } from '@commons/dynamodb.class';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

/**
 * @description uses dynamodb getRecordById to fetch a record by id from database
 * @param {APIGatewayEvent} event containing pathParameters with id
 * @returns response of 200 or 404 with record or error respectively
 */
const getPetById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    let response = await new DynameDb(
      process.env.IS_OFFLINE,
      'pets'
    ).getRecordById(event.pathParameters?.id);
    if (Object.keys(response).length == 0) {
      return formatJSONResponse(
        {
          message: 'Pet not found',
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
        Error: 'Pet not Found',
      },
      500
    );
  }
};

export const main = middyfy(getPetById);
