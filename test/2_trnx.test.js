const axios = require("axios");
const jsonData = require("../env.json");
const fs = require("fs");
const { expect } = require("chai");
const agentData = require("../agent.json");
const customerData = require("../users.json");
const transactions = require("../transactions.json");
const { log } = require("console");
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

  it("Deposit 5000 tk to the invalid Agent from system", async () => {
    try {
      const agentPhoneNumber = agentData[agentData.length - 1].phone_number;
      let amount = 5000;
      const response = await axios.post(
        `${jsonData.baseUrl}/transaction/deposit`,
        {
          from_account: "SYSTEM",
          to_account: "02646464",
          amount: amount,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: jsonData.token,
            "X-AUTH-SECRET-KEY": jsonData.secretKey,
          },
        }
      );
      console.log(response.status);
      expect(response.status).equal(404);
    } catch (error) {
      console.error(error.response.status);
      expect(error.response.status).equal(404);
    }
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

  it("Withdraw 1000 tk by customer to an Invalid Agent Number", async () => {
    const customerPhoneNumber =
      customerData[customerData.length - 2].phone_number;
    try {
      const response = await axios.post(
        `${jsonData.baseUrl}/transaction/withdraw/`,
        {
          from_account: customerPhoneNumber,
          to_account: "0465465464",
          amount: 1000,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: jsonData.token,
            "X-AUTH-SECRET-KEY": jsonData.secretKey,
          },
        }
      );
      console.log("1000 Withdrwal:", response.data.message);
      console.log(
        "1000 Withdrwal Current balance:",
        response.data.currentBalance
      );
      console.log("1000 Withdrwal fee:", response.data.fee);
      // let cBalance = response.currentBalance;
      // expect(cBalance).equal(990);
      // expect(String.toString(cBalance)).contains("990");
      expect(response.status).equal(404);
    } catch (error) {
      console.error(error.response.status);
      console.error(error.response.data);
      expect(error.response.status).equal(404);
      // expect(error.response.data.message).to.equal("Agent not found");
    }
  });
  it("Deposit 2000 tk by agent to Invalid customer", async () => {
    const agentPhoneNumber = agentData[agentData.length - 1].phone_number;

    try {
      const response = await axios.post(
        `${jsonData.baseUrl}/transaction/deposit`,
        {
          from_account: agentPhoneNumber,
          to_account: "01635353",
          amount: 2000,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: jsonData.token,
            "X-AUTH-SECRET-KEY": jsonData.secretKey,
          },
        }
      );

      console.log(response);
      // expect(response.data.message).contains("successful");
    } catch (error) {
      console.log(error.response.status);
      expect(error.response.status).equal(404);
    }
  });

  it(" Deposit 2000 tk by agent to customer ", async () => {
    const agentPhoneNumber = agentData[agentData.length - 1].phone_number;
    const customerPhoneNumber =
      customerData[customerData.length - 2].phone_number;
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
      customerData[customerData.length - 2].phone_number;
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

  it("Send 500 tk to another invalid customer and assert expected balance", async () => {
    const customer1PhoneNumber =
      customerData[customerData.length - 2].phone_number;
    const customer2PhoneNumber = "02743747"; // Invalid phone number
    try {
      var response = await axios
        .post(
          `${jsonData.baseUrl}/transaction/sendmoney/`,
          {
            from_account: customer1PhoneNumber,
            to_account: customer2PhoneNumber,
            amount: 500,
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
      expect(response.status).equal(404);
      // Make an assertion based on the response
      // expect(response).to.be.undefined; // Expect the response to be undefined since the request should fail with a 404 error
    } catch (error) {
      console.log(error.response.status); // Log the error status code
      // Make an assertion based on the error status code
      expect(error.response.status).equal(404); // Expect the status code to be 404 since the requested resource is not found
    }
  });

  it("Send 500 tk to another customer and assert expected balance", async () => {
    // const agentPhoneNumber = agentData[agentData.length - 1].phone_number;
    const customer1PhoneNumber =
      customerData[customerData.length - 2].phone_number;
    const customer2PhoneNumber =
      customerData[customerData.length - 1].phone_number;
    var response = await axios
      .post(
        `${jsonData.baseUrl}/transaction/sendmoney`,
        {
          from_account: customer1PhoneNumber,
          to_account: customer2PhoneNumber,
          amount: 500,
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
    // console.log("500 sendMoney:", response.message);
    // console.log("500 sendMoney Current balance:", response.currentBalance);
    // console.log("500 sendMoney fee:", response.fee);
    // let cBalance = response.currentBalance;
    // console.log(cBalance);
    expect(response.currentBalance).equal(485);
    // expect(String.toString(cBalance)).contains("990");
  });
});
