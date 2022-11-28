import { ethers, network, run,  } from "hardhat";

// const hre = from "hardhat";

const main = async () => {
    const [owner,addr1] = await ethers.getSigners();

    // const result = await owner.sendTransaction({to:'0x5063c70976a89A79e73abCA88Ee68045600e239a',value: ethers.utils.parseEther("10000000")})
    // console.log(result)
    // return
    // Compile contracts
    await run("compile");
    console.log("Compiled contracts.");

    const networkName = network.name;
    console.log(networkName);

    // // HBTC
    // const BTC = await ethers.getContractFactory("HBTC");
    // const btc = await BTC.deploy();
    // console.log("Deploy btc:", btc.address);
    //
    // // USDT
    // const USDT = await ethers.getContractFactory("HEP20USDT");
    // const usdt = await USDT.deploy();
    // console.log("Deploy usdt:", usdt.address);
    //
    // WHEC
    const WHEC = await ethers.getContractFactory("WHEC");
    const whec = await WHEC.deploy();
    console.log("Deploy whec:", whec.address);
    // //
    // //
    // // MultiCall
    const MULTICALL = await ethers.getContractFactory("Multicall");
    const multicall = await MULTICALL.deploy();
    console.log("Deploy multicall:",multicall.address);
    // //
    // // PancakeFactory
    const PancakeFactory = await ethers.getContractFactory("PancakeFactory");
    const pancakeFactory = await PancakeFactory.deploy(owner.address);
    console.log("Deploy pancakeFactory:",pancakeFactory.address,"INIT_CODE_PAIR_HASH:",await pancakeFactory.INIT_CODE_PAIR_HASH());
    console.log("npx hardhat verify  --network localhost ",pancakeFactory.address," ",owner.address)

    //
    //
    // PancakeRouter
    const PancakeRouter = await ethers.getContractFactory("PancakeRouter");
    const pancakeRouter = await PancakeRouter.deploy(pancakeFactory.address,whec.address);
    console.log("Deploy pancakeRouter:",pancakeRouter.address);
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
