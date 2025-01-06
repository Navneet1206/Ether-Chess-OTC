// truffle-config.cjs
const { config: dotenvConfig } = require("dotenv");
const { HardhatUserConfig } = require("hardhat/config");
require("@nomiclabs/hardhat-ethers");

dotenvConfig(); // Loads .env variables

const SEPOLIA_URL = process.env.SEPOLIA_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

const config = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: SEPOLIA_URL,
      accounts: PRIVATE_KEY !== "" ? [PRIVATE_KEY] : [],
    },
  },
};

module.exports = config;
