import { shortString } from "starknet";

function bigIntToString(bigInt: BigInt) {
    const hexValue: string = "0x" + bigInt.toString(16);
    return shortString.decodeShortString(hexValue);
}


function parseBigInt(value: any) {
    return typeof value === "string" && /^\d+n$/.test(value)
      ? BigInt(value.slice(0, -1))
      : value;
  };

export { bigIntToString, parseBigInt };