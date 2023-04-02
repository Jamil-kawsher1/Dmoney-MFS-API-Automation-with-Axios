const axios = require("axios");
const jsonData = require("../env.json");
const fs = require("fs");
const { expect } = require("chai");
const agentData = require("../agent.json");
const customerData = require("../users.json");
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
    console.log(response.data);
    let token_value = response.data.token;
    jsonData.token = token_value;
    fs.writeFileSync("env.json", JSON.stringify(jsonData));
  });
  it(" Deposit 5000 tk to the Agent from system", async () => {
    const agentPhoneNumber = agentData[agentData.length - 1].phone_number;
    var response = await axios
      .post(
        `${jsonData.baseUrl}/transaction/deposit`,
        {
          from_account: "SYSTEM",
          to_account: agentPhoneNumber,
          amount: 5000,
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
});
