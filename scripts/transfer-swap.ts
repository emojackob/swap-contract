import { ethers, network, run } from "hardhat";
import {loadFixture} from "@nomicfoundation/hardhat-network-helpers";
import {address} from "hardhat/internal/core/config/config-validation";


const now = () => {
    return Date.parse(new Date().toString())+600
}


// swapExactTokensForTokens 根据精确的token交换尽量多的token
// swapTokensForExactTokens 使用尽量少的token交换精确的token
// swapExactETHForTokens 根据精确的ETH交换尽量多的token
// swapTokensForExactETH 使用尽量少的token交换精确的ETH
// swapExactTokensForETH 根据精确的token交换尽量多的ETH
// swapETHForExactTokens 使用尽量少的ETH交换精确的token
// swapExactTokensForTokensSupportingFeeOnTransferTokens 支持收税的根据精确的token交换尽量多的token
// swapExactETHForTokensSupportingFeeOnTransferTokens 支持收税的根据精确的ETH交换尽量多的token
// swapExactTokensForETHSupportingFeeOnTransferTokens 支持收税的根据精确的token交换尽量多的ETH

async function params() {
    const [owner,addr1] = await ethers.getSigners();
    const ROUTER = await ethers.getContractFactory("PancakeRouter");
    const router = await ROUTER.attach("0xAA7D2e47F756973Be2Ea67efFc1FDb11bE13085F");
    console.log("router-->",router.address)
    const FACTORY = await ethers.getContractFactory("PancakeFactory");
    const factory = await FACTORY.attach("0xA5F093F5fBbec08dd54C21056CD1034Dc86B8fdc");
    console.log("factory-->",factory.address,"INIT_CODE_PAIR_HASH:",await factory.INIT_CODE_PAIR_HASH());

    const USDT = await ethers.getContractFactory("HEP20USDT");
    const usdt = await USDT.attach("0x30751d3e35B6e8922819d0ea641D72015C6eAE6F");
    const WHEC = await ethers.getContractFactory("WHEC");
    const whec = await WHEC.attach("0xB7a8CB0293165eB3F06d99b17E9d7d8d9DeF8CbD");
    const BTC = await ethers.getContractFactory("HBTC");
    const btc = await BTC.attach("0xCA0c66F6BAcE642a274B28773bB5Ba57c919E245");

    return {owner,router,factory,usdt,whec,btc}
}

const main = async () => {

    const {owner,router,factory,usdt,whec} = await params();

    const balance = await usdt.balanceOf(owner.address)

    //检测USDT是否授权router花费
    const allowance = await usdt.allowance(owner.address,router.address)
    if (!balance.lte(allowance)) {
        console.log("usdt授权 合约 ",ethers.utils.formatEther(balance))
        await usdt.approve(router.address,balance);
    }else {
        console.log("usdt已授权",ethers.utils.formatEther(balance))
    }

    //给定eth输入，获取最大usdt输出
    const outMaxAmounts = await router.getAmountsOut(
        ethers.utils.parseEther("1"),[whec.address,usdt.address])
    console.log("最大换取数量",ethers.utils.formatEther(outMaxAmounts[1]))


    await router.swapExactETHForTokens(
        ethers.utils.parseEther("800"),
        [whec.address,usdt.address],
        owner.address,
        now(),{value:ethers.utils.parseEther("1")})

    const result = await router.swapExactETHForTokensSupportingFeeOnTransferTokens(
        ethers.utils.parseEther("800"),
        [whec.address,usdt.address],
        owner.address,
        now(),{value:ethers.utils.parseEther("1")})
    console.log("result---->",result.hash)
    await result.wait(1);
    console.log("usdt balance",ethers.utils.formatEther(await usdt.balanceOf(owner.address)))

};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
