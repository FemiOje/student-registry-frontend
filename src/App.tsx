import Header from '../src/components/Header';
import Table from '../src/components/Table';
import { StarknetProvider } from '../src/starknet-provider';
import { Toaster } from 'react-hot-toast';


function App() {
  return (
    <>
    <StarknetProvider >
        <Toaster />
        <Header />
        <Table />
    </StarknetProvider>
    </>
  )
};

export default App;
