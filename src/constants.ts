import { erc20Abi } from "viem";
import {CTFVaultAbi} from "./abis/CTFVaultAbi.ts";
import {ConditionalTokensAbi} from "./abis/ConditionalTokensAbi.ts";

const CTFVaultAddress = "0x28A702e64E53935E4d469B82D149ce7be86Fa2aE";
const ConditionalTokensAddress = "0x4D97DCd97eC945f40cF65F87097ACe5EA0476045";
const USDCAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const DefaultDecimals = 6;
const CONDITION_ID = "0x2731af2c4b3fc1d92ce12f08aa03e44dca52e1a9a3b8920fae773207281c1343";
const YES_TOKEN_ID = "31885363547019960542394968337604928772474887535653707168627361045421574616103";
const NO_TOKEN_ID = "63049210301082080146304921747331210163715615540799071043677749257766249890512";
const RPC_URL = "https://polygon-rpc.com";
const ConditionName = "Bitcoin Price Up or Down, 16th January 12 PM ET";
const USDCAbi = erc20Abi;

export {
    CTFVaultAddress,
    ConditionalTokensAddress,
    USDCAddress,
    DefaultDecimals,
    CONDITION_ID,
    YES_TOKEN_ID,
    NO_TOKEN_ID,
    RPC_URL,
    ConditionName,
    CTFVaultAbi,
    ConditionalTokensAbi,
    USDCAbi,
}