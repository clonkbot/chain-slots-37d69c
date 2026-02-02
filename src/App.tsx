import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SlotMachine from './components/SlotMachine';
import WalletConnect from './components/WalletConnect';
import TransactionLog from './components/TransactionLog';
import StatsPanel from './components/StatsPanel';
import './styles.css';

export interface Transaction {
  id: string;
  type: 'bet' | 'win' | 'fee';
  amount: number;
  timestamp: Date;
  hash: string;
}

export interface WalletState {
  connected: boolean;
  address: string;
  balance: number;
  network: string;
}

function App() {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: '',
    balance: 0,
    network: '',
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalWagered, setTotalWagered] = useState(0);
  const [totalWon, setTotalWon] = useState(0);
  const [adminFees, setAdminFees] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const ADMIN_FEE_PERCENT = 2.5;

  const generateTxHash = () => {
    return '0x' + Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  };

  const addTransaction = useCallback((type: Transaction['type'], amount: number) => {
    const tx: Transaction = {
      id: crypto.randomUUID(),
      type,
      amount,
      timestamp: new Date(),
      hash: generateTxHash(),
    };
    setTransactions(prev => [tx, ...prev].slice(0, 50));
  }, []);

  const handleConnect = useCallback(() => {
    const mockAddress = '0x' + Array.from({ length: 40 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    setWallet({
      connected: true,
      address: mockAddress,
      balance: 1000,
      network: 'Ethereum Mainnet',
    });
  }, []);

  const handleDisconnect = useCallback(() => {
    setWallet({
      connected: false,
      address: '',
      balance: 0,
      network: '',
    });
  }, []);

  const handleBet = useCallback((betAmount: number) => {
    if (!wallet.connected || wallet.balance < betAmount || isSpinning) return;

    setWallet(prev => ({ ...prev, balance: prev.balance - betAmount }));
    setTotalWagered(prev => prev + betAmount);
    addTransaction('bet', betAmount);
    setIsSpinning(true);
  }, [wallet.connected, wallet.balance, isSpinning, addTransaction]);

  const handleWin = useCallback((winAmount: number) => {
    const fee = winAmount * (ADMIN_FEE_PERCENT / 100);
    const netWin = winAmount - fee;

    setWallet(prev => ({ ...prev, balance: prev.balance + netWin }));
    setTotalWon(prev => prev + netWin);
    setAdminFees(prev => prev + fee);

    addTransaction('win', winAmount);
    addTransaction('fee', fee);
    setIsSpinning(false);
  }, [addTransaction]);

  const handleLose = useCallback(() => {
    setIsSpinning(false);
  }, []);

  return (
    <div className="app-container">
      <div className="noise-overlay" />
      <div className="grid-overlay" />

      <motion.header
        className="header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="logo-container">
          <motion.div
            className="logo-glitch"
            animate={{
              textShadow: [
                '0 0 10px #00ffff, 0 0 20px #00ffff',
                '2px 2px 10px #ff00ff, -2px -2px 20px #00ffff',
                '0 0 10px #00ffff, 0 0 20px #00ffff',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            CHAIN<span className="accent">SLOTS</span>
          </motion.div>
          <div className="tagline">Provably Fair On-Chain Gaming</div>
        </div>
        <WalletConnect
          wallet={wallet}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />
      </motion.header>

      <main className="main-content">
        <motion.div
          className="left-panel"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <StatsPanel
            totalWagered={totalWagered}
            totalWon={totalWon}
            adminFees={adminFees}
            feePercent={ADMIN_FEE_PERCENT}
          />
        </motion.div>

        <motion.div
          className="center-panel"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <SlotMachine
            wallet={wallet}
            isSpinning={isSpinning}
            onBet={handleBet}
            onWin={handleWin}
            onLose={handleLose}
          />
        </motion.div>

        <motion.div
          className="right-panel"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <TransactionLog transactions={transactions} />
        </motion.div>
      </main>

      <footer className="footer">
        <div className="smart-contract-info">
          <span className="contract-label">Smart Contract:</span>
          <span className="contract-address">0x742d35Cc6634C0532925a3b844Bc454e4438f44e</span>
          <span className="verified-badge">Verified</span>
        </div>
        <div className="footer-credit">
          Requested by @proto_gogo · Built by @clonkbot
        </div>
      </footer>
    </div>
  );
}

export default App;