const { assert,expect } = require("chai")
const { ethers } = require("hardhat")

//1 使用describe 来描述一个test
describe("SimpleStorage test descripiton", function () {
  //2 beforeeach 的意思是在执行后续每个it之前先执行的内容
  let SimpleStorageFactory, simpleStorage
  beforeEach(async () => {
    SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage")
    simpleStorage = await SimpleStorageFactory.deploy() //注意一定要不能漏await
  })
  //3写一个测试项 it
  it("should start with a number 0", async () => {
    const currentvalue = await simpleStorage.retrieve()
    const expectValue = "0"
    //4 通过chai包中的 assert或者expect来判断
    assert.equal(currentvalue.toString(), expectValue)
    //和assert做相同的事情
    expect(expectValue).to.equal(currentvalue.toString())
  })
  //4 再写一个测试项 it ,yarn hardhat test --grep store 通过grep 来只运行有store单词的测试项
  it("Should update when we call store", async function () {
    const expectedValue = "7"
    const transactionResponse = await simpleStorage.store(expectedValue)
    await transactionResponse.wait(1)

    const currentValue = await simpleStorage.retrieve()
    assert.equal(currentValue.toString(), expectedValue)
  })
})
