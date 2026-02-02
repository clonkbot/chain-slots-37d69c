import { motion } from 'framer-motion';

interface StatsPanelProps {
  totalWagered: number;
  totalWon: number;
  adminFees: number;
  feePercent: number;
}

const StatsPanel: React.FC<StatsPanelProps> = ({
  totalWagered,
  totalWon,
  adminFees,
  feePercent,
}) => {
  const netProfit = totalWon - totalWagered;

  const StatCard: React.FC<{
    label: string;
    value: number;
    prefix?: string;
    suffix?: string;
    highlight?: boolean;
    delay?: number;
  }> = ({ label, value, prefix = '', suffix = '', highlight = false, delay = 0 }) => (
    <motion.div
      className={`stat-card ${highlight ? 'highlight' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1 }}
    >
      <div className="stat-label">{label}</div>
      <motion.div
        className="stat-value"
        key={value}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {prefix}
        {value.toFixed(2)}
        {suffix}
      </motion.div>
    </motion.div>
  );

  return (
    <div className="stats-panel">
      <div className="stats-header">
        <h3>Session Stats</h3>
        <div className="rtp-badge">
          <span>RTP:</span>
          <span className="rtp-value">96.5%</span>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          label="Total Wagered"
          value={totalWagered}
          suffix=" TOKENS"
          delay={0}
        />
        <StatCard
          label="Total Won"
          value={totalWon}
          suffix=" TOKENS"
          delay={1}
        />
        <StatCard
          label="Net Profit/Loss"
          value={netProfit}
          prefix={netProfit >= 0 ? '+' : ''}
          suffix=" TOKENS"
          highlight={true}
          delay={2}
        />
        <StatCard
          label="Admin Fees Paid"
          value={adminFees}
          suffix=" TOKENS"
          delay={3}
        />
      </div>

      <div className="fee-info">
        <div className="fee-header">
          <span className="fee-icon">📊</span>
          <span>Fee Structure</span>
        </div>
        <div className="fee-details">
          <div className="fee-row">
            <span>Platform Fee</span>
            <span className="fee-value">{feePercent}%</span>
          </div>
          <div className="fee-row">
            <span>Applied to</span>
            <span className="fee-value">Winnings only</span>
          </div>
        </div>
      </div>

      <div className="smart-contract-section">
        <div className="section-title">
          <span className="section-icon">⛓️</span>
          Smart Contract Info
        </div>
        <div className="contract-details">
          <div className="contract-row">
            <span className="contract-label">Network</span>
            <span className="contract-value">
              <span className="network-dot eth" />
              Ethereum
            </span>
          </div>
          <div className="contract-row">
            <span className="contract-label">Contract</span>
            <span className="contract-value mono">0x742d...f44e</span>
          </div>
          <div className="contract-row">
            <span className="contract-label">Token</span>
            <span className="contract-value">
              <span className="token-icon">🪙</span>
              SLOT
            </span>
          </div>
          <div className="contract-row">
            <span className="contract-label">Status</span>
            <motion.span
              className="contract-value status"
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="status-dot active" />
              Active
            </motion.span>
          </div>
        </div>
      </div>

      <motion.div
        className="provably-fair"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="pf-header">
          <span className="pf-icon">🔐</span>
          <span>Provably Fair</span>
        </div>
        <p className="pf-text">
          All game outcomes are determined by verifiable on-chain randomness using Chainlink VRF.
        </p>
        <motion.button
          className="verify-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Verify Fairness
        </motion.button>
      </motion.div>
    </div>
  );
};

export default StatsPanel;