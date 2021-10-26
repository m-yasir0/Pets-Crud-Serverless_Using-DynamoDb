import { DynameDb } from '@commons/dynamodb.class';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

/**
 * @description uses dynamodb createRecord to create a new record in database
 * @param {APIGatewayEvent} event containing body with name and tag
 * @returns response of 200 or 500 with created record or error respectively
 */
const addPet: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    let response = await new DynameDb(
      process.env.IS_OFFLINE,
      'pets'
    ).createRecord(event.body);
    return formatJSONResponse(
      {
        response,
      },
      200
    );
  } catch (e) {
    return formatJSONResponse(
      {
        e,
      },
      500
    );
  }
};

export const main = middyfy(addPet);
