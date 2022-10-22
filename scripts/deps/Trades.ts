import {ChainId, Currency, Pair, Token} from "@swap/sdk";
import {wrappedCurrency} from "./wrappedCurrency";
import {BASES_TO_CHECK_TRADES_AGAINST,ADDITIONAL_BASES} from "./constants";

//获取所有交易对
export async function getAllCommonPairs(currencyA?: Currency, currencyB?: Currency): Promise<Pair[]> {
    const bases:Token[] = basesTokens(currencyA,currencyB)
    console.log(bases)
}

//获取基础所有token
const basesTokens: (currencyA: Currency | undefined, currencyB: Currency | undefined) => Token[] = (currencyA?: Currency, currencyB?: Currency) => {
    const chainId = ChainId.MAINNET

    const [tokenA, tokenB] = chainId
        ? [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)]
        : [undefined, undefined]

    const common = BASES_TO_CHECK_TRADES_AGAINST[ChainId.MAINNET] ?? []
    const additionalA = tokenA ? ADDITIONAL_BASES[chainId]?.[tokenA.address] ?? [] : []
    const additionalB = tokenB ? ADDITIONAL_BASES[chainId]?.[tokenB.address] ?? [] : []

    return [...common, ...additionalA, ...additionalB]
}