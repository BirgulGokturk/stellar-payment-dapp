import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';
import * as utils from './stellar-utils';

vi.mock('./stellar-utils', () => ({
  connectWallet: vi.fn(),
  getBalance: vi.fn(),
  sendPayment: vi.fn(),
  pollTransactionStatus: vi.fn(),
  fetchRecentEvents: vi.fn(),
}));

describe('Stellar Payment dApp UI', () => {
  it('renders connect wallet button initially', () => {
    render(<App />);
    expect(screen.getByText(/Cüzdan Bağla/i)).toBeInTheDocument();
  });

  it('shows error state correctly', async () => {
    utils.connectWallet.mockRejectedValueOnce(new Error('Connection Rejected'));
    render(<App />);
    
    const connectBtn = screen.getByText(/Cüzdan Bağla/i);
    fireEvent.click(connectBtn);
    
    // Check if error alert is shown (mocked)
    // The App calls window.alert in catch
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    await new Promise(r => setTimeout(r, 0)); // flush promises
    expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('Connection Rejected'));
    alertMock.mockRestore();
  });

  it('renders dashboard when wallet is connected', async () => {
    utils.connectWallet.mockResolvedValue('GABSZ2GS3R75WOYMQOGD5Z4IPXP6WKFH4H7ZYUMS4UJZ7ZEQV2H6VU4M');
    utils.getBalance.mockResolvedValue('100.00');
    
    render(<App />);
    const connectBtn = screen.getByText(/Cüzdan Bağla/i);
    fireEvent.click(connectBtn);
    
    await screen.findByText(/MEVCUT BAKİYE/i);
    expect(screen.getByText('100.00')).toBeInTheDocument();
  });
});
