import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("swap", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deploySwap() {

        // Contracts are deployed using the first signer/account by default
        const [owner, addr1] = await ethers.getSigners();
        const USDT = await ethers.getContractFactory("HEP20USDT");
        const usdt = USDT.deploy();
        const WHEC = await ethers.getContractFactory("WHEC");
        const whec = await WHEC.deploy();
        const BTC = await ethers.getContractFactory("HBTC");
        const btc = await BTC.deploy();
        const PancakeFactory = await ethers.getContractFactory("PancakeFactory");
        const factory = await PancakeFactory.deploy(owner.address);
        const PancakeRouter = await ethers.getContractFactory("PancakeRouter");
        const router = await PancakeRouter.deploy(factory.address,whec.address);

        return {router,factory,usdt,whec,btc,owner,addr1};
    }

    describe("Deployment", function () {
        it("Should set the right unlockTime", async function () {
            const { factory } = await loadFixture(deploySwap);
            console.log("Deploy pancakeFactory:",factory.address,"INIT_CODE_PAIR_HASH:",await factory.INIT_CODE_PAIR_HASH());

        });
    });

    describe("Withdrawals", function () {
        describe("Validations", function () {

        })
    });
});