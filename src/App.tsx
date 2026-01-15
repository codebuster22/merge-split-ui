import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { MarketInfoBar } from './components/layout/MarketInfoBar';
import { DepositWithdrawPage } from './pages/DepositWithdrawPage';
import { MergeSplitPage } from './pages/MergeSplitPage';

function App() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <MarketInfoBar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Routes>
          <Route path="/" element={<Navigate to="/deposit-withdraw" replace />} />
          <Route path="/deposit-withdraw" element={<DepositWithdrawPage />} />
          <Route path="/merge-split" element={<MergeSplitPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
