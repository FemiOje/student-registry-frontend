Contract Address: 0x079c3197737dc4b3451f1c4faefabbb7a20b3fc10474804c5b7aeaf49512cce0

# Student Registry

## Contract Address
`0x079c3197737dc4b3451f1c4faefabbb7a20b3fc10474804c5b7aeaf49512cce0`

---

## Connect Logic

Wallet connection is handled in the `App` component.

```typescript
const { connectAsync } = useConnect({});
const { address } = useAccount();
const { disconnect } = useDisconnect();
const [isModalOpen, setIsModalOpen] = useState(false);

const connectWalletWithModal = async (connector: Connector) => {
  try {
    await connectAsync({ connector: connector });
    toast.success("Wallet connected");
    setIsModalOpen(false);
  } catch (error) {
    toast.error(`Error occurred: ${error}`);
  }
};
```

Each component that needs to affirm the connection status calls useAccount
