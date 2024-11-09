import { shortString } from "starknet";

function bigIntToString(bigInt: BigInt) {
    const hexValue: string = "0x" + bigInt.toString(16);
    return shortString.decodeShortString(hexValue);
}

export { bigIntToString };