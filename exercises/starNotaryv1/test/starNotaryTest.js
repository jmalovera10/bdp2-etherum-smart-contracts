const StarNotary = artifacts.require("StarNotary");

let accounts, owner;

contract("StarNotary", (accs) => {
  accounts = accs;
  owner = accounts[0];
});

it("has correct name", async () => {
  const instance = await StarNotary.deployed();
  const starName = await instance.starName.call();
  assert.equal(starName, "Awesome Udacity Star");
});

it("can be claimed", async () => {
  let instance = await StarNotary.deployed(); // Making sure the Smart Contract is deployed and getting the instance.
  await instance.claimStar({ from: owner }); // Calling the Smart Contract function claimStar
  let starOwner = await instance.starOwner.call(); // Getting the owner address
  assert.equal(starOwner, owner); // Verifying if the owner address match with owner of the address
});

it("can change owners", async () => {
  let instance = await StarNotary.deployed();
  let secondUser = accounts[1];
  await instance.claimStar({ from: owner });
  let starOwner = await instance.starOwner.call();
  assert.equal(starOwner, owner);
  await instance.claimStar({ from: secondUser });
  let secondOwner = await instance.starOwner.call();
  assert.equal(secondOwner, secondUser);
});
