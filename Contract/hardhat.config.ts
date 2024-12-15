import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import { config as dotenvConfig } from "dotenv";

dotenvConfig(); // Loads .env variables

const SEPOLIA_URL = process.env.SEPOLIA_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: SEPOLIA_URL,
      accounts: PRIVATE_KEY !== "" ? [PRIVATE_KEY] : [],
    },
  },
};

export default config;
