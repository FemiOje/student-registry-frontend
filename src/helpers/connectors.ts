import { InjectedConnector } from "starknetkit/injected";
import { ArgentMobileConnector, isInArgentMobileAppBrowser } from "starknetkit/argentMobile";
import { WebWalletConnector } from "starknetkit/webwallet";


const connectors = isInArgentMobileAppBrowser() ? [
  ArgentMobileConnector.init({
    options: {
      dappName: "Student Registry",
      projectId: "student-registry-id",
      url: window.location.hostname
    },
    inAppBrowserOptions: {},
  })
] : [
  new InjectedConnector({ options: { id: "braavos", name: "Braavos" }}),
  new InjectedConnector({ options: { id: "argentX", name: "Argent X" }}),
  new WebWalletConnector({ url: "https://web.argent.xyz" }),
  ArgentMobileConnector.init({
    options: {
      dappName: "Student Registry",
      projectId: "student-registry-id",
      url: window.location.hostname
    }
  })
];

export { connectors };