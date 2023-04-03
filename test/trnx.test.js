const axios = require("axios");
const jsonData = require("../env.json");
const fs = require("fs");
const { expect } = require("chai");
const agentData = require("../agent.json");
const customerData = require("../users.json");
const transactions = require("../transactions.json");
describe("User can do transaction", () => {
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
    // console.log(response.data);
    let token_value = response.data.token;
    jsonData.token = token_value;
    fs.writeFileSync("env.json", JSON.stringify(jsonData));
  });
  it(" Deposit 5000 tk to the Agent from system", async () => {
    const agentPhoneNumber = agentData[agentData.length - 1].phone_number;
    let amount = 5000;
    var response = await axios
      .post(
        `${jsonData.baseUrl}/transaction/deposit`,
        {
          from_account: "SYSTEM",
          to_account: agentPhoneNumber,
          amount: amount,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: jsonData.token,
            "X-AUTH-SECRET-KEY": jsonData.secretKey,
          },
        }
      )
      .then((res) => res.data);

    console.log(response);
    expect(response.message).contains("successful");

    // Add user transactions to the transactions object

    // Add agent transactions to the transactions object
    transactions.agentTransactions.push({
      amount: amount,
      trnxid: response.trnxId,
    });

    // Write transactions object to JSON file
    fs.writeFile("transactions.json", JSON.stringify(transactions), (err) => {
      if (err) throw err;
      console.log("Transactions saved to transactions.json");
    });
  });

  it(" Deposit 2000 tk by agent to customer ", async () => {
    const agentPhoneNumber = agentData[agentData.length - 1].phone_number;
    const customerPhoneNumber =
      customerData[customerData.length - 1].phone_number;
    var response = await axios
      .post(
        `${jsonData.baseUrl}/transaction/deposit`,
        {
          from_account: agentPhoneNumber,
          to_account: customerPhoneNumber,
          amount: 2000,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: jsonData.token,
            "X-AUTH-SECRET-KEY": jsonData.secretKey,
          },
        }
      )
      .then((res) => res.data);

    console.log(response);
    expect(response.message).contains("successful");
  });

  it("Withdraw 1000 tk by customer and assert expected balance", async () => {
    const agentPhoneNumber = agentData[agentData.length - 1].phone_number;
    const customerPhoneNumber =
      customerData[customerData.length - 1].phone_number;
    var response = await axios
      .post(
        `${jsonData.baseUrl}/transaction/withdraw/`,
        {
          from_account: customerPhoneNumber,
          to_account: agentPhoneNumber,
          amount: 1000,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: jsonData.token,
            "X-AUTH-SECRET-KEY": jsonData.secretKey,
          },
        }
      )
      .then((res) => res.data);

    console.log("1000 Withdrwal:", response.message);
    console.log("1000 Withdrwal Current balance:", response.currentBalance);
    console.log("1000 Withdrwal fee:", response.fee);
    let cBalance = response.currentBalance;
    expect(cBalance).equal(990);
    // expect(String.toString(cBalance)).contains("990");
  });
});
