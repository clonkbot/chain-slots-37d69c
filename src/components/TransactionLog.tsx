import { motion, AnimatePresence } from 'framer-motion';
import type { Transaction } from '../App';

interface TransactionLogProps {
  transactions: Transaction[];
}

const TransactionLog: React.FC<TransactionLogProps> = ({ transactions }) => {
  const getTypeIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'bet': return '🎲';
      case 'win': return '💰';
      case 'fee': return '📋';
    }
  };

  const getTypeClass = (type: Transaction['type']) => {
    switch (type) {
      case 'bet': return 'tx-bet';
      case 'win': return 'tx-win';
      case 'fee': return 'tx-fee';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  return (
    <div className="transaction-log">
      <div className="log-header">
        <h3>Transaction Log</h3>
        <div className="log-status">
          <motion.div
            className="status-dot"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.7, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span>Live</span>
        </div>
      </div>

      <div className="log-content">
        <AnimatePresence initial={false}>
          {transactions.length === 0 ? (
            <motion.div
              className="empty-log"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="empty-icon">📜</div>
              <p>No transactions yet</p>
              <p className="empty-subtext">Connect wallet and spin to start</p>
            </motion.div>
          ) : (
            transactions.map((tx, index) => (
              <motion.div
                key={tx.id}
                className={`tx-item ${getTypeClass(tx.type)}`}
                initial={{ opacity: 0, x: 50, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: -50, height: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30,
                  delay: index === 0 ? 0 : 0,
                }}
              >
                <div className="tx-icon">{getTypeIcon(tx.type)}</div>
                <div className="tx-details">
                  <div className="tx-row">
                    <span className="tx-type">{tx.type.toUpperCase()}</span>
                    <span className="tx-amount">
                      {tx.type === 'bet' ? '-' : '+'}
                      {tx.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="tx-row secondary">
                    <span className="tx-hash">{truncateHash(tx.hash)}</span>
                    <span className="tx-time">{formatTime(tx.timestamp)}</span>
                  </div>
                </div>
                <motion.a
                  href="#"
                  className="tx-link"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => e.preventDefault()}
                  title="View on Etherscan"
                >
                  ↗
                </motion.a>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <div className="log-footer">
        <span className="log-count">{transactions.length} transactions</span>
        <motion.button
          className="view-all-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          View All
        </motion.button>
      </div>
    </div>
  );
};

export default TransactionLog;