const hre = require("hardhat");

async function main() {
  console.log("Deploying HerbionYX contracts...");

  // Get the ContractFactory and Signers here.
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy AccessControl contract
  const AccessControl = await hre.ethers.getContractFactory("AccessControl");
  const accessControl = await AccessControl.deploy();
  await accessControl.waitForDeployment();
  
  const accessControlAddress = await accessControl.getAddress();
  console.log("AccessControl deployed to:", accessControlAddress);

  // Deploy BatchRegistry contract
  const BatchRegistry = await hre.ethers.getContractFactory("BatchRegistry");
  const batchRegistry = await BatchRegistry.deploy(accessControlAddress);
  await batchRegistry.waitForDeployment();
  
  const batchRegistryAddress = await batchRegistry.getAddress();
  console.log("BatchRegistry deployed to:", batchRegistryAddress);

  // Save contract addresses
  const fs = require('fs');
  const contractAddresses = {
    AccessControl: accessControlAddress,
    BatchRegistry: batchRegistryAddress,
    network: hre.network.name,
    chainId: hre.network.config.chainId
  };

  fs.writeFileSync(
    './src/config/contracts.json',
    JSON.stringify(contractAddresses, null, 2)
  );

  console.log("Contract addresses saved to src/config/contracts.json");
  console.log("Deployment completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });