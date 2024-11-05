import Header from '../src/components/Header';
import Table from '../src/components/Table';
import StarknetProvider from '../src/starknet-provider';

function App() {
  return (
    <StarknetProvider >
      <div>
        <Header />
        <Table />
      </div>
    </StarknetProvider>
  )
};

export default App;
