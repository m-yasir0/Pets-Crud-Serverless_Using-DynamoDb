import { DynameDb } from '@commons/dynamodb.class';
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

/**
 * @description uses dynamodb deleteRecord to delete a record by id from database
 * @param {APIGatewayEvent} event containing pathParameters with id
 * @returns response of 200 or 500 with deleted record id or error respectively
 */
const deletePet: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  try {
    let response = await new DynameDb(
      process.env.IS_OFFLINE,
      'pets'
    ).deleteRecordById(event.pathParameters?.id);
    return formatJSONResponse(
      {
        response,
      },
      200
    );
  } catch (e) {
    formatJSONResponse(
      {
        e,
      },
      500
    );
  }
};

export const main = middyfy(deletePet);
