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
    // // WHEC
    // const WHEC = await ethers.getContractFactory("WHEC");
    // const whec = await WHEC.deploy();
    // console.log("Deploy whec:", whec.address);
    //
    //
    // // MultiCall
    // const MULTICALL = await ethers.getContractFactory("Multicall");
    // const multicall = await MULTICALL.deploy();
    // console.log("Deploy multicall:",multicall.address);
    //
    // // PancakeFactory
    // const PancakeFactory = await ethers.getContractFactory("PancakeFactory");
    // const pancakeFactory = await PancakeFactory.deploy(owner.address);
    // console.log("Deploy pancakeFactory:",pancakeFactory.address,"INIT_CODE_PAIR_HASH:",await pancakeFactory.INIT_CODE_PAIR_HASH());
    // console.log("npx hardhat verify  --network localhost ",pancakeFactory.address," ",owner.address)


    // PancakeRouter01
    const PancakeRouter01 = await ethers.getContractFactory("PancakeRouter01");
    const pancakeRouter01 = await PancakeRouter01.deploy("0xA5F093F5fBbec08dd54C21056CD1034Dc86B8fdc","0xB7a8CB0293165eB3F06d99b17E9d7d8d9DeF8CbD");
    console.log("Deploy pancakeRouter01:",pancakeRouter01.address);


    // PancakeRouter
    const PancakeRouter = await ethers.getContractFactory("PancakeRouter");
    const pancakeRouter = await PancakeRouter.deploy("0xA5F093F5fBbec08dd54C21056CD1034Dc86B8fdc","0xB7a8CB0293165eB3F06d99b17E9d7d8d9DeF8CbD");
    console.log("Deploy pancakeRouter:",pancakeRouter.address);

    // const IterableMapping = await ethers.getContractFactory("IterableMapping");
    // const im = await IterableMapping.deploy();
    // console.log("Deploy IterableMapping:",im.address)
    // const tx = await ethers.getContractFactory("TelegramXmoon",{
    //     libraries:{
    //         "IterableMapping": im.address
    //     }
    // });
    // const ptx = await tx.deploy();
    // console.log("Deploy TelegramXmoon:",ptx.address)

    // await run("verify:verify", {
    //     address: "0x3A4A56656eE41C5f9bc594d678975D4F4CB55176",
    //     constructorArguments: [],
    //     libraries: {
    //         IterableMapping: "0x483A59f0385B8eAEe4aa6cD482e0860b2B0C8bEd"
    //     }
    // })
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
