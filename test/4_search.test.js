const axios = require("axios");
const jsonData = require("../env.json");
const fs = require("fs");
const { expect } = require("chai");
const { it } = require("mocha");
const userData = require("../users.json");

describe("Search With Deffrent Option", () => {
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

  it("Search by the customer by invalid phone number", async () => {
    try {
      var response = await axios
        .get(`${jsonData.baseUrl}/user/search/phonenumber/"017344641"`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: jsonData.token,
            "X-AUTH-SECRET-KEY": jsonData.secretKey,
          },
        })
        .then((res) => res.data);
      console.log(response.message);
    } catch (error) {
      console.log(error.response.status);

      expect(error.response.status).equal(404);
    }
  });

  it("Search by the customer phone number", async () => {
    let phonenumber = userData[userData.length - 1].phone_number;
    var response = await axios
      .get(`${jsonData.baseUrl}/user/search/phonenumber/${phonenumber}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: jsonData.token,
          "X-AUTH-SECRET-KEY": jsonData.secretKey,
        },
      })
      .then((res) => res.data);

    console.log(response.message);
  });
});
