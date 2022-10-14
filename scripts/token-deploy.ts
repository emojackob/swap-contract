import { ethers, network, run } from "hardhat";

const main = async () => {
    const [owner,addr1] = await ethers.getSigners();
    const TOKEN = await ethers.getContractFactory("TokenERC20");
    const token = await TOKEN.deploy("CAKE");
    console.log(token.address)
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
