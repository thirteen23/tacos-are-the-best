"use strict";
const AWS = require("aws-sdk");
const S3 = new AWS.S3();

module.exports.tacos = async (event) => {
  const TACO_DESCRIPTION = {
    type: getParameter(event, "type"),
    tortilla: getParameter(event, "tortilla"),
    filling1: getParameter(event, "filling1"),
    filling2: getParameter(event, "filling2"),
    filling3: getParameter(event, "filling3"),
    salsa: getParameter(event, "salsa")
  };

  const data =
    process.env.LOCAL_DEV === "true"
      ? require(`./data/tacos.json`)
      : null; 
  
  const bucket = "tacos-are-the-best";
  const key = `tacos.json`;
  const params = {
    Bucket: bucket,
    Key: key,
  };

  let tacoData;
  if (process.env.LOCAL_DEV === "true") {
    tacoData = data;
  } else {
    let fileData;
    try {
      fileData = await S3.getObject(params).promise();
    } catch (error) {
      console.log(error);
    }
    let fileContents = fileData.Body.toString("utf-8");
    tacoData = JSON.parse(fileContents);
  }
  
  const TACO_COUNT = filterTacos(tacoData, TACO_DESCRIPTION)

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `You have matched ${TACO_COUNT} tacos!`,
        input: event,
      },
      null,
      2
    ),
  };
};

function getParameter(event, item) {
  if (event.queryStringParameters && event.queryStringParameters[item]) {
    return event.queryStringParameters[item];
  } else {
    return "";
  }
}

function filterTacos(data, TACO_DESCRIPTION) {
  const TACOS = data.collection;
  return TACOS.filter(taco => 
    taco.type === TACO_DESCRIPTION.type && 
    taco.tortilla === TACO_DESCRIPTION.tortilla &&
    taco.filling1 === TACO_DESCRIPTION.filling1 &&
    taco.filling2 === TACO_DESCRIPTION.filling2 &&
    taco.filling3 === TACO_DESCRIPTION.filling3 &&
    taco.salsa === TACO_DESCRIPTION.salsa
  ).length;
}
