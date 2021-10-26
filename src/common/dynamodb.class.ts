import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';

/**
 *  Dynamoclass used to operate local as well as online instance of DynamoDb
 */
export class DynameDb {
  client: any;
  table: string;

  /**
   * @description Make deleration of Class variables client instance and table
   * @param {Boolean|String}IS_OFFLINE checks if server is running offline
   * @param {string} table Name of table to access
   * @returns {DynameDb} Instance of class
   */
  constructor(IS_OFFLINE: string | boolean, table: string) {
    if (process.env.NODE_ENV == 'test') IS_OFFLINE = true;
    if (IS_OFFLINE) {
      let options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
      };
      this.client = new AWS.DynamoDB.DocumentClient(options);
    } else {
      this.client = new AWS.DynamoDB.DocumentClient();
    }

    // set table
    this.table = table;

    return this;
  }

  /**
   * @description returns scan promise which resolves scanned data depending on query param
   * @param {[key: string]: string}query object include any of tags or limit or null
   * @returns {Promise} dynamodb scan promise
   */
  getAllRecords(query: { [key: string]: string }) {
    let params: { [key: string]: string | Object } = {
      TableName: this.table,
    };

    if (!query) {
      return this.client.scan(params).promise();
    } else if (query.limit && !query.tags) {
      params.Limit = query.limit;
      return this.client.scan(params).promise();
    } else if (!query.limit && query.tags) {
      params.FilterExpression = 'tag = :tags';
      params.ExpressionAttributeValues = {
        ':tags': query.tags,
      };
      return this.client.scan(params).promise();
    } else {
      params.Limit = query.limit;
      params.FilterExpression = 'tag = :tags';
      params.ExpressionAttributeValues = {
        ':tags': query.tags,
      };
      return this.client.scan(params).promise();
    }
  }

  /**
   * @description fetch and return record by id
   * @param {string} id of record to fetch
   * @returns {Promise} promise that resolve data requested
   */
  getRecordById(id: string) {
    let record = this.client
      .get({
        TableName: this.table,
        Key: {
          id: id,
        },
      })
      .promise();
    return record;
  }

  /**
   * @description Create new record in dynamodb
   * @param {[key: string]: string | Object } body constaining name and tag
   * @returns {Promise} promise that resolve record created or rejects error
   */
  createRecord(body: { [key: string]: string | Object }) {
    const { name, tag } = body;
    const id = uuid();
    let promise = new Promise((resolve, reject) => {
      let params = {
        TableName: this.table,
        Item: {
          id,
          name,
          tag,
        },
      };
      this.client.put(params, (err) => {
        if (err) reject(err);
        else resolve(params.Item);
      });
    });
    return promise;
  }

  /**
   * @description delete record by id in dynamodb
   * @param {string} id of record to delete
   * @returns {Promise} promise that resolve if data is deleted
   */
  deleteRecordById(id: string) {
    let promise = new Promise((resolve, reject) => {
      let params = {
        TableName: this.table,
        Key: {
          id,
        },
      };
      this.client.delete(params, (err) => {
        if (err) reject(err);
        else resolve(`Record deleted: ${params.Key.id}`);
      });
    });
    return promise;
  }
}
