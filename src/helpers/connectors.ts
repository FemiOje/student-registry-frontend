import { InjectedConnector } from "starknetkit/injected";
import { ArgentMobileConnector, isInArgentMobileAppBrowser } from "starknetkit/argentMobile";
import { WebWalletConnector } from "starknetkit/webwallet";
import { constants } from "starknet";

export const availableConnectors = isInArgentMobileAppBrowser()
  ? [
    ArgentMobileConnector.init({
      options: {
        url: typeof window !== "undefined" ? window.location.href : "",
        dappName: "Student Registry",
        projectId: "student-registry-id",
        chainId: constants.NetworkName.SN_SEPOLIA,
      },
      inAppBrowserOptions: {},
    }),
  ]
  : [
    new InjectedConnector({ options: { id: "argentX", name: "Argent X" } }),
    new InjectedConnector({ options: { id: "braavos", name: "Braavos" } }),
    new WebWalletConnector({ url: "https://web.argent.xyz" }),
  ];