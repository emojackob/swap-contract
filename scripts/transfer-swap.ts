import {ethers} from "hardhat";
import {Fraction,Currency, CurrencyAmount, Percent, Price, Token, TokenAmount,Route,Pair,WHEC,HEC,ChainId} from "@swap/sdk";
import JSBI from "jsbi";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/src/signers";
import {Contract} from "@ethersproject/contracts";
import {getAllPairsAddress} from "../src/Trades";

const now = () => {
    return Date.parse(new Date().toString())+600
}


// swapExactTokensForTokens 根据精确的token交换尽量多的token
// swapTokensForExactTokens 使用尽量少的token交换精确的token

// swapTokensForExactETH 使用尽量少的token交换精确的ETH
// swapExactTokensForETH 根据精确的token交换尽量多的ETH
// swapExactETHForTokens 根据精确的ETH交换尽量多的token
// swapETHForExactTokens 使用尽量少的ETH交换精确的token

// swapExactTokensForTokensSupportingFeeOnTransferTokens 支持收税的根据精确的token交换尽量多的token
// swapExactETHForTokensSupportingFeeOnTransferTokens 支持收税的根据精确的ETH交换尽量多的token
// swapExactTokensForETHSupportingFeeOnTransferTokens 支持收税的根据精确的token交换尽量多的ETH

const BIPS_BASE = JSBI.BigInt(10000)
const ONE = JSBI.BigInt(1)


async function params() {
    const [owner,addr1] = await ethers.getSigners();
    const ROUTER = await ethers.getContractFactory("PancakeRouter");
    const router = await ROUTER.attach("0xAA7D2e47F756973Be2Ea67efFc1FDb11bE13085F");
    // console.log("router-->",router.address)
    const FACTORY = await ethers.getContractFactory("PancakeFactory");
    const factory = await FACTORY.attach("0xA5F093F5fBbec08dd54C21056CD1034Dc86B8fdc");
    // console.log("factory-->",factory.address,"INIT_CODE_PAIR_HASH:",await factory.INIT_CODE_PAIR_HASH());

    const USDT = await ethers.getContractFactory("HEP20USDT");
    const usdt = await USDT.attach("0x30751d3e35B6e8922819d0ea641D72015C6eAE6F");


    const WHEC = await ethers.getContractFactory("WHEC");
    const whec = await WHEC.attach("0xB7a8CB0293165eB3F06d99b17E9d7d8d9DeF8CbD");

    const BTC = await ethers.getContractFactory("HBTC");
    const btc = await BTC.attach("0xCA0c66F6BAcE642a274B28773bB5Ba57c919E245");

    const Multicall = await ethers.getContractFactory("Multicall");
    const multicall = await Multicall.attach("0x18CCcE28F097749d682F76CD470C4d5626C047Be");

    return {owner,router,factory,multicall,usdt,whec,btc}
}

const main = async () => {
    const {owner,router,factory,multicall,usdt,whec,btc} = await params();

    // 单个方法调用案例
    // await routerSwapExactETHForTokens("1",usdt,10,owner,router,factory)

    // 完整封装调用案例
    swapExactETHForTokens("1",usdt,10,owner,router,factory,multicall)

};


// 1 用户精确输入HEC 兑换一定数量USDT ,userInputHEC，滑点百分比 滑点计算获得目标最小USDT 数量
async function routerSwapExactETHForTokens(userInputHEC: string,//用户输入的hec数量
                                           usdtContract: Contract,//token合约
                                           userInputAllowedSlippage: number,//用户输入的滑点百分比
                                           owner: SignerWithAddress,//地址帐号带签名
                                           routerContract: Contract, //路由合约地址
                                           factoryContract: Contract,//工厂合约地址
                                           ) {
    //包装的token对象，方便计算
    const usdtToken = new Token(627,usdtContract.address,18,"USDT","USDT","https://xxxx")

    const balance = await owner.getBalance()

    //查询交易对是否存在
    const pairAddress = await factoryContract.getPair(WHEC[ChainId.MAINNET].address,usdtContract.address);
    if (pairAddress === ethers.constants.AddressZero) {
        console.error("交易对未创建")
        return
    }else {
        console.log("hec/usdt 交易对地址: ",pairAddress)
    }

    //判断HEC余额是否足够
    if (!ethers.utils.parseEther(userInputHEC).lte(balance)) {
        console.error("hec余额不足: ",ethers.utils.formatEther(balance))
        return
    }

    //给定HEC输入，获取最大usdt输出
    const outMaxAmounts = await routerContract.getAmountsOut(
        ethers.utils.parseEther(userInputHEC),[WHEC[ChainId.MAINNET].address,usdtContract.address])
    console.log("最大换取数量",ethers.utils.formatEther(outMaxAmounts[1]))

    //计算显示最小输出token数量
    //滑点计算
    const slippageTolerance = new Percent(JSBI.BigInt(userInputAllowedSlippage * 100), BIPS_BASE)
    //滑点 最小输出token数量
    const slippageAdjustedAmountOut = new Fraction(ONE)
        .add(slippageTolerance)
        .invert()
        .multiply(outMaxAmounts[1]).quotient
    const usdtAmount = new TokenAmount(usdtToken, slippageAdjustedAmountOut)
    console.log("用于给用户显示滑点后最小获得目标币数量---->",usdtAmount.toFixed(1,undefined,0))

    //调用交易兑换接口
    const result = await routerContract.swapExactETHForTokens(
        usdtAmount.raw.toString(),//滑点后最小输出
        [WHEC[ChainId.MAINNET].address,usdtContract.address],//交易对地址
        owner.address,//输出接受地址
        now(), //交易截至时间
        {value:ethers.utils.parseEther(userInputHEC)} //调用附带主链币HEC
    )

    console.log("交易hash---->",result.hash)
    //框架代码，等待区块确认
    await result.wait(1);
    console.log("usdt 余额: ",ethers.utils.formatEther(await usdtContract.balanceOf(owner.address)))
}

async function swapExactETHForTokens(userInputHEC: string,//用户输入的hec数量
                        usdtContract: Contract,//token合约
                        userInputAllowedSlippage: number,//用户输入的滑点百分比
                        owner: SignerWithAddress,//地址帐号带签名
                        routerContract: Contract, //路由合约地址
                        factoryContract: Contract,//工厂合约地址
                                     multicall: Contract,//合并调用合约
) {
    //包装的token对象，方便计算
    const usdtToken = new Token(627,usdtContract.address,18,"USDT","USDT","https://xxxx")

    //获取所有交易对地址
    const pairAddress =  getAllPairsAddress(HEC,usdtToken)
    console.log(pairAddress)

    //调用multipleContract检查交易对状态

    return
}

// async function asd() {
//     //检测USDT是否授权router花费
//     const allowance = await usdt.allowance(owner.address,router.address)
//     if (!balance.lte(allowance)) {
//         console.log("usdt授权 合约 ",ethers.utils.formatEther(balance))
//         const usdtResult = await usdt.approve(router.address,balance);
//         await usdtResult.wait(1) //框架代码，等待区块确认
//     }else {
//         console.log("usdt已授权",ethers.utils.formatEther(balance))
//     }
// }

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
