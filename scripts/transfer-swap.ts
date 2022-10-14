import { ethers, network, run } from "hardhat";

const main = async () => {
    const [owner,addr1] = await ethers.getSigners();
    const ROUTER = await ethers.getContractFactory("PancakeRouter");
    const router = await ROUTER.attach("0xCC77902f1A72E20834B0a16BAaFc2a123dF7eEBb");

    console.log(router.address)

    const FACTORY = await ethers.getContractFactory("PancakeFactory");
    const factory = await FACTORY.attach("0xA5F093F5fBbec08dd54C21056CD1034Dc86B8fdc");
    console.log("Deploy pancakeFactory:",factory.address,"INIT_CODE_PAIR_HASH:",await factory.INIT_CODE_PAIR_HASH());
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
