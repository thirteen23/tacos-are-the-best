"use strict";
const AWS = require("aws-sdk");

module.exports.tacos = async (event) => {
  const QUERYOBJ = {
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
  
  const TACOCOUNT = filterTacos(data, QUERYOBJ)

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `You have matched ${TACOCOUNT} tacos!`,
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

function filterTacos(data, queryObj) {
  const TACOS = data.collection;
  return TACOS.filter(taco => 
    taco.type === queryObj.type && 
    taco.tortilla === queryObj.tortilla &&
    taco.filling1 === queryObj.filling1 &&
    taco.filling2 === queryObj.filling2 &&
    taco.filling3 === queryObj.filling3 &&
    taco.salsa === queryObj.salsa
  ).length;
}
