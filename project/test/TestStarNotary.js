const StarNotary = artifacts.require("StarNotary");

var accounts;
var owner;

contract("StarNotary", (accs) => {
  accounts = accs;
  owner = accounts[0];
});

describe("Star Notary v2 tests", () => {
  let instance;
  let user1;
  let user2;

  beforeEach(async () => {
    instance = await StarNotary.deployed();
    user1 = accounts[1];
    user2 = accounts[2];
  });

  it("can Create a Star", async () => {
    let tokenId = 1;
    await instance.createStar("Awesome Star!", tokenId, { from: accounts[0] });
    assert.equal(await instance.tokenIdToStarInfo.call(tokenId), "Awesome Star!");
  });

  it("lets user1 put up their star for sale", async () => {
    let starId = 2;
    let starPrice = web3.utils.toWei(".01", "ether");
    await instance.createStar("awesome star", starId, { from: user1 });
    await instance.putStarUpForSale(starId, starPrice, { from: user1 });
    assert.equal(await instance.starsForSale.call(starId), starPrice);
  });

  it("lets user1 get the funds after the sale", async () => {
    let starId = 3;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar("awesome star", starId, { from: user1 });
    await instance.putStarUpForSale(starId, starPrice, { from: user1 });
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
    await instance.buyStar(starId, { from: user2, value: balance });
    let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
    let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
    let value2 = Number(balanceOfUser1AfterTransaction);
    assert.equal(value1, value2);
  });

  it("lets user2 buy a star, if it is put up for sale", async () => {
    let starId = 4;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar("awesome star", starId, { from: user1 });
    await instance.putStarUpForSale(starId, starPrice, { from: user1 });
    await instance.buyStar(starId, { from: user2, value: balance });
    assert.equal(await instance.ownerOf.call(starId), user2);
  });

  it("lets user2 buy a star and decreases its balance in ether", async () => {
    let starId = 5;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar("awesome star", starId, { from: user1 });
    await instance.putStarUpForSale(starId, starPrice, { from: user1 });
    const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, { from: user2, value: balance, gasPrice: 0 });
    const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
    let value = Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);
    assert.equal(value, starPrice);
  });
});

// Implement Task 2 Add supporting unit tests
describe("Project testing", () => {
  let instance;
  let user1;
  let user2;

  beforeEach(async () => {
    instance = await StarNotary.deployed();
    user1 = accounts[1];
    user2 = accounts[2];
  });

  it("can add the star name and star symbol properly", async () => {
    //2. Call the name and symbol properties in your Smart Contract and compare with the name and symbol provided
    const name = await instance.name.call();
    const symbol = await instance.symbol.call();

    assert.equal(name, "Glowing Stars");
    assert.equal(symbol, "GLW");
  });

  it("lets 2 users exchange stars", async () => {
    // 1. create 2 Stars with different tokenId
    const starName1 = "Testing Star1";
    const tokenId1 = 6;
    const starName2 = "Testing Star2";
    const tokenId2 = 7;

    await instance.createStar(starName1, tokenId1, { from: user1 });
    await instance.createStar(starName2, tokenId2, { from: user2 });
    // 2. Call the exchangeStars functions implemented in the Smart Contract
    await instance.exchangeStars(tokenId1, tokenId2, { from: user1 });
    // 3. Verify that the owners changed
    assert.equal(await instance.ownerOf.call(tokenId1), user2);
    assert.equal(await instance.ownerOf.call(tokenId2), user1);
  });

  it("lets a user transfer a star", async () => {
    // 1. create a Star with different tokenId
    const starName1 = "Testing Star3";
    const tokenId1 = 8;

    await instance.createStar(starName1, tokenId1, { from: user1 });
    // 2. use the transferStar function implemented in the Smart Contract
    await instance.transferStar(user2, tokenId1, { from: user1 });
    // 3. Verify the star owner changed.
    assert.equal(await instance.ownerOf.call(tokenId1), user2);
  });

  it("lookUptokenIdToStarInfo test", async () => {
    // 1. create a Star with different tokenId
    const starName1 = "Testing Star4";
    const tokenId1 = 9;

    await instance.createStar(starName1, tokenId1, { from: user1 });
    // 2. Call your method lookUptokenIdToStarInfo
    const starInfo = await instance.lookUptokenIdToStarInfo.call(tokenId1);
    // 3. Verify if you Star name is the same
    assert.equal(starInfo, starName1);
  });
});
