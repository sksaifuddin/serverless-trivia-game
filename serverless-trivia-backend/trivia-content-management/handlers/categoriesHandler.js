"use strict";

const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

// POST : create a category API
//POST: https://api/categories
// {
//     "category": "Science",
//     "description": "Questions about science"
//   }

module.exports.createCategory = async (event) => {
  const { category, description } = JSON.parse(event.body);
  const params = {
    TableName: process.env.CATEGORIES_TABLE,
    Item: { category, description },
  };

  try {
    await db.put(params).promise();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(params.Item),
    };
  } catch (dbError) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(dbError),
    };
  }
};
// PUT: updates description of category in API
//PUT: https://api/categories
// {
//     "category": "Science",
//     "newDescription": "Questions about science and nature"
//   }

module.exports.updateCategory = async (event) => {
  const { category, newDescription } = JSON.parse(event.body);
  const params = {
    TableName: process.env.CATEGORIES_TABLE,
    Key: { category },
    UpdateExpression: "set description = :description",
    ExpressionAttributeValues: { ":description": newDescription },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    await db.update(params).promise();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ category, description: newDescription }),
    };
  } catch (dbError) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(dbError),
    };
  }
};
// DELETE the entire category
//DELETE: https://api/categories
// {
//
//     "category": "Science"
//   }

module.exports.deleteCategory = async (event) => {
  const { category } = JSON.parse(event.body);
  const params = {
    TableName: process.env.CATEGORIES_TABLE,
    Key: { category },
  };

  try {
    await db.delete(params).promise();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ category }),
    };
  } catch (dbError) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(dbError),
    };
  }
};

//get all categories API : fetch all the categories from the database.
//GET: https://api/categories
// {
// }

module.exports.getAllCategories = async (event) => {
  const params = {
    TableName: process.env.CATEGORIES_TABLE,
  };

  console.log("Scanning DynamoDB table: ", params.TableName);

  try {
    const result = await db.scan(params).promise();
    console.log("Scan result: ", result);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(result.Items),
    };
  } catch (dbError) {
    console.error("Error in DynamoDB scan: ", dbError);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(dbError),
    };
  }
};
