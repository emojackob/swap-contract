import { ethers, network, run } from "hardhat";

const main = async () => {
    const [owner,addr1] = await ethers.getSigners();
    const USDT = await ethers.getContractFactory("HEP20USDT");
    console.log("call--->")
    const usdt = await USDT.attach("0x30751d3e35B6e8922819d0ea641D72015C6eAE6F");

    const balance = await usdt.balanceOf(owner.address);
    console.log(balance)

    const result = await usdt.transfer('0x5063c70976a89A79e73abCA88Ee68045600e239a',ethers.utils.parseEther("1000"));
    console.log(result)


    // const factory = await ethers.getContractFactory("TelegramX");
    // const panF = await factory.attach("0x9B82103F1b7BF1CF163DCFC2d9c268f5cFb1441f");
    // const sett = await panF.viewBalanceOfReceiver();
    // console.log(sett)
    // const result = await owner.sendTransaction({to:'0x5063c70976a89A79e73abCA88Ee68045600e239a',value: ethers.utils.parseEther("10000000")})
    // console.log(result)
    // return
    // Compile contracts
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
