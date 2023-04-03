const axios = require("axios");
const jsonData = require("../env.json");
const fs = require("fs");
const { expect } = require("chai");
const { it } = require("mocha");
const userData = require("../users.json");
const { log } = require("console");
const transaction = require("../transactions.json");

describe("Check Balance And Statemnt", () => {
  before(async () => {
    var response = await axios.post(
      `${jsonData.baseUrl}/user/login`,
      {
        email: "salman@roadtocareer.net",
        password: "1234",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);
    let token_value = response.data.token;
    jsonData.token = token_value;
    fs.writeFileSync("env.json", JSON.stringify(jsonData));
  });
  it("Check balance of customer", async () => {
    let phonenumber = userData[userData.length - 1].phone_number;
    let response = await axios
      .get(`${jsonData.baseUrl}/transaction/balance/${phonenumber}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: jsonData.token,
          "X-AUTH-SECRET-KEY": jsonData.secretKey,
        },
      })
      .then((res) => res.data);
    expect(response.message).contains("User balance");
    // console.log("Balance Response:", response);
  });

  it("Check Statement by Trasaction ID", async () => {
    let phonenumber = userData[userData.length - 1].phone_number;
    const agentsTransactionId =
      transaction.agentTransactions[transaction.agentTransactions.length - 1]
        .trnxid;
    let response = await axios
      .get(`${jsonData.baseUrl}/transaction/search/${agentsTransactionId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: jsonData.token,
          "X-AUTH-SECRET-KEY": jsonData.secretKey,
        },
      })
      .then((res) => res.data);
    expect(response.message).contains("Transaction list");
    // console.log("Statement Response:", response);
  });

  it("Check CustomerStatement by Phone Number", async () => {
    let phonenumber = userData[userData.length - 2].phone_number;
    const agentsTransactionId =
      transaction.agentTransactions[transaction.agentTransactions.length - 1]
        .trnxid;
    let response = await axios
      .get(`${jsonData.baseUrl}/transaction/statement/${phonenumber}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: jsonData.token,
          "X-AUTH-SECRET-KEY": jsonData.secretKey,
        },
      })
      .then((res) => res.data);
    expect(response.message).contains("Transaction list");
    // console.log("Statement Response:", response);
  });
});