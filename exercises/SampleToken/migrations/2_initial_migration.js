const SampleToken = artifacts.require("SampleToken");

module.exports = function (deployer) {
  deployer.deploy(SampleToken, "Camichan Token", "CHT", 1000);
};
