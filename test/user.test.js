const { expect } = require("chai");
const axios = require("axios");
const jsonData = require("../env.json");
const fs = require("fs");
const { faker } = require("@faker-js/faker");
var rand = require("../generateRandom");

const userData = require("../users.json");

describe("Users Actions", () => {
  it("User can login successfully", async () => {
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
    expect(response.data.message).contains("Login successfully");
    let token_value = response.data.token;
    jsonData.token = token_value;
    fs.writeFileSync("env.json", JSON.stringify(jsonData));
  });

  it("Admin can create user", async () => {
    let _name = faker.name.fullName();
    let _email = faker.internet.email().toLowerCase();
    let _phone_number = "015010" + rand(10000, 99999);
    let _nid_num = "199" + rand(100000, 999999);
    var response = await axios
      .post(
        `${jsonData.baseUrl}/user/create`,
        {
          name: _name,
          email: _email,
          password: "1234",
          phone_number: _phone_number,
          nid: _nid_num,
          role: "Customer",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: jsonData.token,
            "X-AUTH-SECRET-KEY": jsonData.secretKey,
          },
        }
      )
      .then((res) => res.data.user);
    console.log(response);

    var id = response.id;
    var name = response.name;
    var email = response.email;
    var phone_number = response.phone_number;
    var role = response.role;

    var newUser = {
      id: id,
      name: name,
      email: email,
      phone_number: phone_number,
      role: role,
    };

    userData.push(newUser);

    fs.writeFileSync("users.json", JSON.stringify(userData));
    console.log("Saved!");
  });

  //   ///agent creation
  it("Admin can create new  agent", async () => {
    let _name = faker.name.fullName();
    let _email = faker.internet.email().toLowerCase();
    let _phone_number = "015010" + rand(10000, 99999);
    let _nid_num = "199" + rand(100000, 999999);
    var response = await axios
      .post(
        `${jsonData.baseUrl}/user/create`,
        {
          name: _name,
          email: _email,
          password: "1234",
          phone_number: _phone_number,
          nid: _nid_num,
          role: "Agent",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: jsonData.token,
            "X-AUTH-SECRET-KEY": jsonData.secretKey,
          },
        }
      )
      .then((res) => res.data.user);
    console.log(response);

    var id = response.id;
    var name = response.name;
    var email = response.email;
    var phone_number = response.phone_number;
    var role = response.role;

    var newAgent = {
      id: id,
      name: name,
      email: email,
      phone_number: phone_number,
      role: role,
    };

    userData.push(newAgent);

    fs.writeFileSync("agent.json", JSON.stringify(userData));
    console.log("Saved!");
  });
});
