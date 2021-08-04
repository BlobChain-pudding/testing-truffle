// https://ethereum.stackexchange.com/questions/17558/what-does-deploy-link-exactly-do-in-truffle (this is for deploying library onto blockchain and importing libs in subsequent smart contract)
const Factory = artifacts.require("Factory");
const ReviewFunctionality = artifacts.require("ReviewFunctions");
const TokenFunctionality = artifacts.require("ReservationTokenFunctions");

module.exports = function (deployer) {
  deployer.deploy(Factory);
  deployer.deploy(TokenFunctionality);
  deployer.deploy(ReviewFunctionality);
};
