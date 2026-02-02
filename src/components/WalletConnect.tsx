import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WalletState } from '../App';

interface WalletConnectProps {
  wallet: WalletState;
  onConnect: () => void;
  onDisconnect: () => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({
  wallet,
  onConnect,
  onDisconnect,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const handleWalletSelect = async (walletType: string) => {
    setConnecting(true);
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    onConnect();
    setConnecting(false);
    setShowModal(false);
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <>
      <div className="wallet-section">
        {wallet.connected ? (
          <motion.div
            className="wallet-connected"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="wallet-info">
              <div className="wallet-balance">
                <span className="balance-value">{wallet.balance.toFixed(2)}</span>
                <span className="balance-label">TOKENS</span>
              </div>
              <div className="wallet-address">
                <div className="network-indicator" />
                <span>{truncateAddress(wallet.address)}</span>
              </div>
            </div>
            <motion.button
              className="disconnect-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onDisconnect}
            >
              Disconnect
            </motion.button>
          </motion.div>
        ) : (
          <motion.button
            className="connect-btn"
            whileHover={{
              scale: 1.02,
              boxShadow: '0 0 30px rgba(0, 255, 255, 0.4)',
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowModal(true)}
          >
            <span className="btn-icon">🔗</span>
            Connect Wallet
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !connecting && setShowModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>Connect Wallet</h2>
                <motion.button
                  className="close-btn"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowModal(false)}
                  disabled={connecting}
                >
                  ✕
                </motion.button>
              </div>

              {connecting ? (
                <div className="connecting-state">
                  <motion.div
                    className="connecting-spinner"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  <p>Connecting to wallet...</p>
                  <p className="connecting-subtext">Please approve the connection in your wallet</p>
                </div>
              ) : (
                <div className="wallet-options">
                  <motion.button
                    className="wallet-option"
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleWalletSelect('metamask')}
                  >
                    <div className="wallet-icon metamask">
                      <svg viewBox="0 0 40 40" fill="none">
                        <path d="M32.96 5L21.6 13.84l2.12-4.96L32.96 5z" fill="#E2761B"/>
                        <path d="M7.04 5l11.28 8.92-2.04-5.04L7.04 5zM28.8 26.56l-3.04 4.64 6.48 1.8 1.84-6.36-5.28-.08zM5.92 26.64l1.84 6.36 6.48-1.8-3.04-4.64-5.28.08z" fill="#E4761B"/>
                        <path d="M14.04 17.44l-1.8 2.72 6.4.28-.24-6.88-4.36 3.88zM25.96 17.44l-4.44-3.96-.16 6.96 6.4-.28-1.8-2.72z" fill="#E4761B"/>
                        <path d="M14.24 31.2l3.84-1.88-3.32-2.6-.52 4.48zM21.92 29.32l3.84 1.88-.52-4.48-3.32 2.6z" fill="#E4761B"/>
                      </svg>
                    </div>
                    <div className="wallet-details">
                      <span className="wallet-name">MetaMask</span>
                      <span className="wallet-desc">Connect using browser extension</span>
                    </div>
                    <div className="wallet-arrow">→</div>
                  </motion.button>

                  <motion.button
                    className="wallet-option"
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleWalletSelect('walletconnect')}
                  >
                    <div className="wallet-icon walletconnect">
                      <svg viewBox="0 0 40 40" fill="none">
                        <path d="M12.6 14.6c4.08-4 10.72-4 14.8 0l.48.48a.52.52 0 010 .72l-1.68 1.64a.26.26 0 01-.36 0l-.68-.64a7.72 7.72 0 00-10.32 0l-.72.68a.26.26 0 01-.36 0l-1.68-1.64a.52.52 0 010-.72l.52-.52zm18.28 3.4l1.48 1.44a.52.52 0 010 .72l-6.68 6.52a.52.52 0 01-.72 0l-4.72-4.64a.13.13 0 00-.18 0l-4.72 4.64a.52.52 0 01-.72 0L8.64 20.16a.52.52 0 010-.72l1.48-1.44a.52.52 0 01.72 0l4.72 4.64a.13.13 0 00.18 0l4.72-4.64a.52.52 0 01.72 0l4.72 4.64a.13.13 0 00.18 0l4.72-4.64a.52.52 0 01.72 0z" fill="#3B99FC"/>
                      </svg>
                    </div>
                    <div className="wallet-details">
                      <span className="wallet-name">WalletConnect</span>
                      <span className="wallet-desc">Scan QR code with mobile wallet</span>
                    </div>
                    <div className="wallet-arrow">→</div>
                  </motion.button>

                  <motion.button
                    className="wallet-option"
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleWalletSelect('coinbase')}
                  >
                    <div className="wallet-icon coinbase">
                      <svg viewBox="0 0 40 40" fill="none">
                        <circle cx="20" cy="20" r="16" fill="#0052FF"/>
                        <path d="M20 10c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm0 15.6c-3.08 0-5.6-2.52-5.6-5.6s2.52-5.6 5.6-5.6 5.6 2.52 5.6 5.6-2.52 5.6-5.6 5.6z" fill="white"/>
                      </svg>
                    </div>
                    <div className="wallet-details">
                      <span className="wallet-name">Coinbase Wallet</span>
                      <span className="wallet-desc">Connect using Coinbase Wallet</span>
                    </div>
                    <div className="wallet-arrow">→</div>
                  </motion.button>
                </div>
              )}

              <div className="modal-footer">
                <p>By connecting, you agree to our Terms of Service</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WalletConnect;