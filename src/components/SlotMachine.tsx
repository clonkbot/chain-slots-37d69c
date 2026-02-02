import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WalletState } from '../App';

interface SlotMachineProps {
  wallet: WalletState;
  isSpinning: boolean;
  onBet: (amount: number) => void;
  onWin: (amount: number) => void;
  onLose: () => void;
}

const SYMBOLS = ['💎', '🔷', '⭐', '🌟', '💰', '🎰', '7️⃣', '🍒'];
const WIN_MULTIPLIERS: Record<string, number> = {
  '💎': 50,
  '7️⃣': 25,
  '💰': 15,
  '🎰': 10,
  '⭐': 8,
  '🌟': 5,
  '🔷': 3,
  '🍒': 2,
};

const SlotMachine: React.FC<SlotMachineProps> = ({
  wallet,
  isSpinning,
  onBet,
  onWin,
  onLose,
}) => {
  const [reels, setReels] = useState<string[]>(['💎', '💎', '💎']);
  const [betAmount, setBetAmount] = useState(10);
  const [showWin, setShowWin] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [spinningReels, setSpinningReels] = useState([false, false, false]);

  const spin = () => {
    if (!wallet.connected || wallet.balance < betAmount || isSpinning) return;

    onBet(betAmount);
    setShowWin(false);
    setSpinningReels([true, true, true]);

    // Stop reels with delays
    const stopTimes = [1000, 1500, 2000];
    const finalReels: string[] = [];

    stopTimes.forEach((time, index) => {
      setTimeout(() => {
        const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        finalReels[index] = symbol;
        setReels(prev => {
          const newReels = [...prev];
          newReels[index] = symbol;
          return newReels;
        });
        setSpinningReels(prev => {
          const newSpinning = [...prev];
          newSpinning[index] = false;
          return newSpinning;
        });

        if (index === 2) {
          // Check for win
          setTimeout(() => {
            checkWin(finalReels);
          }, 300);
        }
      }, time);
    });
  };

  const checkWin = (finalReels: string[]) => {
    const [a, b, c] = finalReels;
    if (a === b && b === c) {
      // Jackpot!
      const multiplier = WIN_MULTIPLIERS[a] || 2;
      const win = betAmount * multiplier;
      setWinAmount(win);
      setShowWin(true);
      onWin(win);
    } else if (a === b || b === c || a === c) {
      // Partial win
      const matchSymbol = a === b ? a : (b === c ? b : a);
      const multiplier = (WIN_MULTIPLIERS[matchSymbol] || 2) / 5;
      const win = Math.floor(betAmount * multiplier);
      if (win > 0) {
        setWinAmount(win);
        setShowWin(true);
        onWin(win);
      } else {
        onLose();
      }
    } else {
      onLose();
    }
  };

  const SpinningReel: React.FC<{ symbol: string; isSpinning: boolean; delay: number }> = ({
    symbol,
    isSpinning: reelSpinning,
  }) => {
    const [displaySymbol, setDisplaySymbol] = useState(symbol);

    useEffect(() => {
      if (!reelSpinning) {
        setDisplaySymbol(symbol);
        return;
      }

      const interval = setInterval(() => {
        setDisplaySymbol(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
      }, 50);

      return () => clearInterval(interval);
    }, [reelSpinning, symbol]);

    return (
      <motion.div
        className="reel"
        animate={reelSpinning ? {
          y: [0, -10, 0, 10, 0],
        } : {}}
        transition={reelSpinning ? {
          duration: 0.1,
          repeat: Infinity,
        } : {
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }}
      >
        <div className="reel-inner">
          <motion.span
            className="symbol"
            key={displaySymbol}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            {displaySymbol}
          </motion.span>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="slot-machine">
      <div className="machine-frame">
        <div className="machine-header">
          <motion.div
            className="jackpot-display"
            animate={{
              textShadow: [
                '0 0 10px #ffd700',
                '0 0 20px #ffd700, 0 0 30px #ff6b00',
                '0 0 10px #ffd700',
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="jackpot-label">JACKPOT</span>
            <span className="jackpot-value">50,000 TOKENS</span>
          </motion.div>
        </div>

        <div className="reels-container">
          <div className="reels-glow" />
          <div className="reels">
            {reels.map((symbol, index) => (
              <SpinningReel
                key={index}
                symbol={symbol}
                isSpinning={spinningReels[index]}
                delay={index * 0.5}
              />
            ))}
          </div>
          <div className="win-line" />
        </div>

        <AnimatePresence>
          {showWin && (
            <motion.div
              className="win-overlay"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <motion.div
                className="win-text"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [-2, 2, -2],
                }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                WIN!
              </motion.div>
              <motion.div
                className="win-amount"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                +{winAmount.toFixed(2)} TOKENS
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="controls">
          <div className="bet-controls">
            <span className="bet-label">BET AMOUNT</span>
            <div className="bet-buttons">
              <motion.button
                className="bet-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setBetAmount(Math.max(1, betAmount - 5))}
                disabled={isSpinning}
              >
                -5
              </motion.button>
              <div className="bet-display">{betAmount}</div>
              <motion.button
                className="bet-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setBetAmount(Math.min(wallet.balance, betAmount + 5))}
                disabled={isSpinning}
              >
                +5
              </motion.button>
            </div>
            <div className="quick-bets">
              {[10, 25, 50, 100].map(amount => (
                <motion.button
                  key={amount}
                  className={`quick-bet ${betAmount === amount ? 'active' : ''}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setBetAmount(Math.min(wallet.balance, amount))}
                  disabled={isSpinning}
                >
                  {amount}
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button
            className="spin-btn"
            whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(0, 255, 255, 0.5)' }}
            whileTap={{ scale: 0.98 }}
            onClick={spin}
            disabled={!wallet.connected || wallet.balance < betAmount || isSpinning}
          >
            {!wallet.connected ? (
              'CONNECT WALLET'
            ) : isSpinning ? (
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                SPINNING...
              </motion.span>
            ) : (
              'SPIN'
            )}
          </motion.button>
        </div>

        <div className="payout-table">
          <div className="payout-title">PAYOUTS</div>
          <div className="payout-grid">
            {Object.entries(WIN_MULTIPLIERS).slice(0, 4).map(([symbol, mult]) => (
              <div key={symbol} className="payout-item">
                <span className="payout-symbols">{symbol}{symbol}{symbol}</span>
                <span className="payout-mult">×{mult}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotMachine;