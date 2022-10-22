
// a list of tokens by chain
import {ChainId, Token} from "@swap/sdk";
import { mainnetTokens, testnetTokens } from './tokens'

type ChainTokenList = {
    readonly [chainId in ChainId]: Token[]
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
    [ChainId.MAINNET]: [
        mainnetTokens.wbnb,
        mainnetTokens.hbtc,
        mainnetTokens.usdt,
    ],
    [ChainId.TESTNET]: [testnetTokens.wbnb, testnetTokens.cake, testnetTokens.busd],
}

/**
 * Addittional bases for specific tokens
 * @example { [WBTC.address]: [renBTC], [renBTC.address]: [WBTC] }
 */
export const ADDITIONAL_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
    [ChainId.MAINNET]: {},
}