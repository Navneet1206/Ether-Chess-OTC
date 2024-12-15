import { ethers } from "hardhat";

async function main() {
  // Get the contract factory
  const ChessGame = await ethers.getContractFactory("ChessGame");

  console.log("Deploying ChessGame...");

  // Fetch the current gas price using the provider
  const gasPrice = await ethers.provider.getGasPrice();

  // Deploy the contract with the current gas price
  const tx = await ChessGame.deploy({
    gasLimit: 3000000,
    gasPrice,
  });

  // Wait for deployment to be mined
  const receipt = await tx.deployTransaction.wait();
  console.log("Transaction mined in block:", receipt.blockNumber);
  console.log("ChessGame deployed to:", tx.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
