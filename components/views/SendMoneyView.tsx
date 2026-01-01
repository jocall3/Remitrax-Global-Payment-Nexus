
// RE-ENACTED & EXPANDED: This component has been resurrected from its deprecated state.
// It is now "Remitrax," a complete, multi-rail payment portal featuring advanced
// security simulations and demonstrating enterprise-level integration patterns.

import React, { useState, useContext, useRef, useEffect, useCallback } from 'react';
import Card from '../Card';
import { DataContext } from '../../context/DataContext';
import { View, Transaction } from '../../types';
import { getFinancialInsights } from '../../services/gemini';

// ================================================================================================
// GLOBAL REMITRAX PLATFORM WIDE TYPE DEFINITIONS
// ================================================================================================

export type PaymentRail = 'quantumpay' | 'cashapp' | 'swift_global' | 'blockchain_dlt' | 'interstellar_p2p' | 'neuro_link' | 'ai_contract_escrow';
export type ScanState = 'scanning' | 'success' | 'verifying' | 'error' | 'recalibrating' | 'quantum_sync' | 'ai_negotiating';

export interface RemitraxRecipientProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  quantumTag?: string;
  cashtag?: string;
  swiftDetails?: { bankName: string; bic: string; accountNumber: string; };
  blockchainAddress?: string;
  neuroLinkAddress?: string;
  galacticP2PId?: string;
  preferredCurrency?: string;
  lastUsedDate?: string;
  trustScore?: number;
  kycStatus?: 'verified' | 'pending' | 'unverified';
  blacklisted?: boolean;
  bankAccounts?: { bankName: string; accountNumber: string; routingNumber?: string; iban?: string; }[];
  complianceFlags?: string[];
}

export interface RemitraxCurrency {
  code: string;
  name: string;
  symbol: string;
  isCrypto: boolean;
  conversionRate?: number;
  quantumFluctuationIndex?: number;
  decimalPlaces: number;
  minTransactionAmount?: number;
  maxTransactionAmount?: number;
  liquidityScore?: number;
  marketCap?: number;
  regulatoryStatus?: 'regulated' | 'unregulated' | 'experimental';
}

export interface ScheduledPaymentRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'once_on_date' | 'conditional_event';
  startDate: string;
  endDate?: string;
  executionCondition?: string;
  paymentReason?: string;
  biometricApprovalRequired?: boolean;
  maxExecutions?: number;
}

export interface AdvancedTransactionSettings {
  priority: 'low' | 'normal' | 'high' | 'ultra_quantum';
  carbonOffsetRatio: number;
  privacyLevel: 'standard' | 'enhanced' | 'fully_anonymous_dlt';
  dynamicFeeOptimization: 'auto' | 'manual';
  dataEncryptionStandard: 'aes256' | 'quantum_resistant_hybrid' | 'zero_knowledge_proof' | 'obfuscated_vault';
  routeOptimizationPreference: 'speed' | 'cost' | 'privacy' | 'sustainability' | 'compliance';
  regulatoryReportingFlags: string[];
  postQuantumSecurityEnabled: boolean;
  notificationPreferences: { email: boolean; sms: boolean; push: boolean; holo_alert: boolean; };
  multiSignatureRequired?: boolean;
  escrowDetails?: { agentId: string; releaseCondition: string; };
  dlcDetails?: { contractId: string; conditions: string; };
}

export interface SecurityAuditResult {
  riskScore: number;
  fraudProbability: number;
  amlCompliance: 'pass' | 'fail' | 'review';
  sanctionScreening: 'pass' | 'fail';
  quantumSignatureIntegrity: 'verified' | 'compromised' | 'pending';
  recommendations: string[];
  complianceAlerts?: string[];
  threatVectorAnalysis?: { type: string; severity: 'low' | 'medium' | 'high'; description: string; }[];
}

export interface EnvironmentalImpactReport {
  transactionCO2e: number;
  offsetCO2e: number;
  netCO2e: number;
  renewableEnergyUsedPercentage: number;
  recommendations?: string[];
}

export interface RailSpecificDetails {
  swift?: { bankName: string; bic: string; accountNumber: string; beneficiaryAddress: string; };
  blockchain?: { network: 'ethereum' | 'polygon' | 'solana' | 'custom_dlt' | ''; gasLimit: string; dataPayload?: string; };
  interstellar?: { galaxyId: string; starSystemAddress: string; vesselIdentifier?: string; };
  neuroLink?: { neuralSignatureType: 'brainwave' | 'retinal_pattern' | ''; recipientId: string; neuroSyncProtocolVersion?: string; };
  aiContractEscrow?: { contractTemplateId: string; escrowConditions: string; resolutionAgentId?: string; immutableLedgerHash?: string; };
  quantumpay?: { channelProtocol: string; encryptionStandard: string; quantumSignatureAlgorithm?: string; };
}

interface SendMoneyViewProps {
  setActiveView: (view: View) => void;
}

// UI Sub-components
export const AnimatedCheckmarkIcon: React.FC = () => (
    <div className="flex items-center justify-center p-4">
        <svg className="h-16 w-16 text-green-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
    </div>
);

export const QuantumLedgerAnimation: React.FC = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
        <div className="grid grid-cols-4 gap-2">
            {[...Array(16)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-cyan-500/30 border border-cyan-500 rounded animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
        </div>
        <p className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase">Syncing Quantum States...</p>
    </div>
);

export const SecurityAuditDisplay: React.FC<{ auditResult: SecurityAuditResult | null }> = ({ auditResult }) => {
    if (!auditResult) return (
        <div className="flex items-center space-x-2 text-yellow-500/80 animate-pulse text-xs font-bold uppercase tracking-widest">
            <i className="fas fa-search"></i>
            <span>Real-time heuristic scan in progress...</span>
        </div>
    );

    return (
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold text-slate-100 uppercase tracking-widest">Security Audit Matrix</h4>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${auditResult.riskScore < 30 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    RISK SCORE: {auditResult.riskScore}/100
                </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
                {auditResult.recommendations.slice(0, 2).map((rec, i) => (
                    <div key={i} className="text-[10px] text-slate-400 flex items-start">
                        <i className="fas fa-info-circle mr-1.5 mt-0.5 text-cyan-500"></i>
                        {rec}
                    </div>
                ))}
            </div>
        </div>
    );
};

export const BiometricModal: React.FC<{
    isOpen: boolean;
    onSuccess: () => void;
    onClose: () => void;
    amount: string;
    recipient: RemitraxRecipientProfile | string;
    paymentMethod: PaymentRail;
    securityContext: 'personal' | 'corporate';
}> = ({ isOpen, onSuccess, onClose, amount, recipient, paymentMethod, securityContext }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [scanState, setScanState] = useState<ScanState>('scanning');

    useEffect(() => {
        if (!isOpen) return;
        
        setScanState('scanning');
        let stream: MediaStream | null = null;

        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) videoRef.current.srcObject = stream;
            } catch (err) {
                setScanState('error');
            }
        };

        startCamera();
        
        const timers = [
            setTimeout(() => setScanState('verifying'), 2500),
            setTimeout(() => setScanState('success'), 4500),
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 6000)
        ];

        return () => {
            timers.forEach(t => clearTimeout(t));
            if (stream) stream.getTracks().forEach(track => track.stop());
        };
    }, [isOpen, onSuccess, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 text-center shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse"></div>
                
                <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">Identity Authentication</h3>
                <p className="text-slate-400 text-sm mb-8 font-medium">Clearance required for {paymentMethod.toUpperCase()} transfer</p>

                <div className="relative w-64 h-64 mx-auto rounded-[3rem] overflow-hidden border-2 border-slate-700 mb-8 bg-black group transition-all duration-500 hover:border-cyan-500/50">
                    <video ref={videoRef} autoPlay muted playsInline className="absolute inset-0 w-full h-full object-cover grayscale opacity-60" />
                    
                    {scanState === 'scanning' && (
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="h-0.5 bg-cyan-400/50 w-full absolute top-0 animate-[scanner_3s_ease-in-out_infinite] shadow-[0_0_15px_#22d3ee]"></div>
                            <div className="absolute inset-0 border-[20px] border-slate-900/50 rounded-[2.5rem]"></div>
                        </div>
                    )}

                    {scanState === 'verifying' && (
                        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-6">
                            <QuantumLedgerAnimation />
                        </div>
                    )}

                    {scanState === 'success' && (
                        <div className="absolute inset-0 bg-green-500/20 backdrop-blur-sm flex items-center justify-center">
                            <AnimatedCheckmarkIcon />
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-ping"></span>
                        <span>{scanState.replace('_', ' ')}: ENCRYPTED_CHANNEL</span>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Abort Protocol</button>
                </div>
            </div>
            <style>{`
                @keyframes scanner {
                    0% { top: 0; }
                    50% { top: 100%; }
                    100% { top: 0; }
                }
            `}</style>
        </div>
    );
};

const SendMoneyView: React.FC<SendMoneyViewProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    if (!context) return null;
    const { addTransaction, userPreferences, userSecurityProfile } = context;

    // State
    const [currentStep, setCurrentStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState<PaymentRail>('quantumpay');
    const [amount, setAmount] = useState('');
    const [remittanceInfo, setRemittanceInfo] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRecipient, setSelectedRecipient] = useState<RemitraxRecipientProfile | null>(null);
    const [aiInsights, setAiInsights] = useState<string[]>([]);
    const [loadingInsights, setLoadingInsights] = useState(false);
    
    const [showBiometricModal, setShowBiometricModal] = useState(false);
    const [securityAudit, setSecurityAudit] = useState<SecurityAuditResult | null>(null);

    // Initial Data
    const recipients: RemitraxRecipientProfile[] = [
        { id: 'r1', name: 'Alice Qubits', quantumTag: '@alice_q', kycStatus: 'verified', trustScore: 98, avatarUrl: 'https://picsum.photos/seed/alice/100' },
        { id: 'r2', name: 'Bob Ledger', cashtag: '$bob_l', kycStatus: 'verified', trustScore: 92, avatarUrl: 'https://picsum.photos/seed/bob/100' },
        { id: 'r3', name: 'NeuroCorp Entity', neuroLinkAddress: 'NL_CORP_99', kycStatus: 'pending', trustScore: 75, avatarUrl: 'https://picsum.photos/seed/corp/100' }
    ];

    // Effects
    useEffect(() => {
        if (searchTerm.length > 2) {
            const found = recipients.find(r => 
                r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                r.quantumTag?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSelectedRecipient(found || null);
        } else {
            setSelectedRecipient(null);
        }
    }, [searchTerm]);

    useEffect(() => {
        const performAudit = () => {
            setSecurityAudit(null);
            setTimeout(() => {
                setSecurityAudit({
                    riskScore: Math.floor(Math.random() * 20) + (parseFloat(amount) > 1000 ? 15 : 0),
                    fraudProbability: 0.02,
                    amlCompliance: 'pass',
                    sanctionScreening: 'pass',
                    quantumSignatureIntegrity: 'verified',
                    recommendations: ['Address verified via Remitrax DNS', 'Heuristic pattern matches known safe vectors']
                });
            }, 1000);
        };
        if (amount && selectedRecipient) performAudit();
    }, [amount, selectedRecipient]);

    const handleFetchInsights = async () => {
        setLoadingInsights(true);
        const insights = await getFinancialInsights({
            amount,
            currency: 'USD',
            recipientName: selectedRecipient?.name || 'Unknown',
            rail: paymentMethod
        });
        setAiInsights(insights);
        setLoadingInsights(false);
    };

    const handleSend = () => {
        if (currentStep === 1) {
            handleFetchInsights();
            setCurrentStep(2);
        } else {
            setShowBiometricModal(true);
        }
    };

    const handleFinalSuccess = () => {
        const tx: Transaction = {
            id: `RTX-${Date.now()}`,
            type: 'expense',
            category: 'Quantum Transfer',
            description: `Sent to ${selectedRecipient?.name || searchTerm} via ${paymentMethod}`,
            amount: parseFloat(amount),
            date: new Date().toISOString().split('T')[0],
            carbonFootprint: parseFloat(amount) * 0.002
        };
        addTransaction(tx);
        setCurrentStep(3);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">Dispatch Asset</h1>
                    <p className="text-slate-400 mt-1">Multi-rail secure transmission terminal.</p>
                </div>
                <div className="flex space-x-1">
                    {[1, 2, 3].map(s => (
                        <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${currentStep >= s ? 'w-8 bg-cyan-500' : 'w-4 bg-slate-800'}`}></div>
                    ))}
                </div>
            </div>

            {currentStep === 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <Card title="Transmission Parameters">
                            <div className="space-y-6">
                                {/* Rail Selector */}
                                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                                    {['quantumpay', 'cashapp', 'swift_global', 'blockchain_dlt', 'interstellar_p2p', 'neuro_link', 'ai_contract_escrow'].map(rail => (
                                        <button
                                            key={rail}
                                            onClick={() => setPaymentMethod(rail as PaymentRail)}
                                            className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all ${
                                                paymentMethod === rail ? 'bg-cyan-500 text-white shadow-lg' : 'bg-slate-900 border border-slate-800 text-slate-500 hover:border-slate-600'
                                            }`}
                                        >
                                            <i className={`fas ${
                                                rail === 'quantumpay' ? 'fa-atom' : 
                                                rail === 'cashapp' ? 'fa-dollar-sign' : 
                                                rail === 'swift_global' ? 'fa-globe' : 
                                                rail === 'blockchain_dlt' ? 'fa-cubes' :
                                                rail === 'neuro_link' ? 'fa-brain' : 'fa-robot'
                                            } mb-2`}></i>
                                            <span className="text-[8px] font-bold uppercase tracking-widest text-center truncate w-full">{rail.split('_')[0]}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Recipient Search */}
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Recipient Nexus ID</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Enter @quantum_tag or name..."
                                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:border-cyan-500 transition-colors"
                                        />
                                        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"></i>
                                    </div>
                                    
                                    {selectedRecipient && (
                                        <div className="mt-4 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center animate-in zoom-in-95 duration-300">
                                            <img src={selectedRecipient.avatarUrl} className="w-12 h-12 rounded-xl mr-4" />
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-white">{selectedRecipient.name}</p>
                                                <p className="text-xs font-mono text-cyan-400">ID: {selectedRecipient.id.toUpperCase()}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest bg-green-500/10 px-2 py-1 rounded">Trust: {selectedRecipient.trustScore}%</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Amount */}
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Asset Magnitude</label>
                                    <div className="relative">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-4xl font-extrabold text-slate-600">$</span>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-10 pl-16 pr-4 text-6xl font-extrabold text-white placeholder-slate-800 focus:border-cyan-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleSend}
                                    disabled={!amount || !selectedRecipient}
                                    className="w-full py-6 rounded-[2rem] bg-cyan-500 text-white text-lg font-bold uppercase tracking-widest shadow-xl shadow-cyan-500/20 hover:bg-cyan-400 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20 disabled:grayscale"
                                >
                                    Initiate Review Cycle
                                </button>
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <SecurityAuditDisplay auditResult={securityAudit} />
                        
                        <Card title="Rail Stats" className="border-slate-800/50">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-medium text-slate-500">Latency</span>
                                    <span className="text-xs font-bold text-green-400 font-mono">1.2ms</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-medium text-slate-500">Througput</span>
                                    <span className="text-xs font-bold text-cyan-400 font-mono">2.4m TPS</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-medium text-slate-500">Security</span>
                                    <span className="text-xs font-bold text-purple-400 font-mono">QUANTUM_LOCK</span>
                                </div>
                            </div>
                        </Card>

                        <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 border-dashed">
                             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center">
                                <i className="fas fa-robot mr-2 text-cyan-500"></i>
                                Remitrax Intelligence
                            </h4>
                            <p className="text-[11px] text-slate-500 leading-relaxed italic">
                                "Select a recipient and specify an amount to receive real-time predictive financial analytics and route optimization insights."
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {currentStep === 2 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-right-8 duration-500">
                    <div className="lg:col-span-2 space-y-6">
                        <Card title="Transaction Integrity Review">
                            <div className="space-y-8">
                                <div className="flex flex-col md:flex-row justify-between p-8 rounded-[2rem] bg-slate-950 border border-slate-800 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full"></div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Magnitude</p>
                                        <p className="text-5xl font-black text-white">${parseFloat(amount).toLocaleString()}</p>
                                        <p className="text-xs font-mono text-cyan-500">USD FIAT_RESERVE</p>
                                    </div>
                                    <div className="mt-6 md:mt-0 flex items-center">
                                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-4">
                                            <i className="fas fa-arrow-right text-slate-500"></i>
                                        </div>
                                        <div className="flex items-center">
                                            <img src={selectedRecipient?.avatarUrl} className="w-16 h-16 rounded-2xl mr-4 border-2 border-slate-800" />
                                            <div>
                                                <p className="text-lg font-bold text-white">{selectedRecipient?.name}</p>
                                                <p className="text-xs font-mono text-slate-500">{selectedRecipient?.quantumTag || selectedRecipient?.id}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Fee Protocol</p>
                                        <p className="text-sm font-bold text-white">$2.40 <span className="text-[10px] font-mono text-slate-600 ml-1">DYNAMIC_OPT</span></p>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Time to finality</p>
                                        <p className="text-sm font-bold text-white">~1.5 seconds</p>
                                    </div>
                                </div>

                                <div className="flex space-x-4">
                                    <button onClick={() => setCurrentStep(1)} className="flex-1 py-5 rounded-3xl bg-slate-900 text-slate-400 font-bold uppercase tracking-widest border border-slate-800 hover:text-white transition-all">Adjust</button>
                                    <button onClick={handleSend} className="flex-[2] py-5 rounded-3xl bg-cyan-500 text-white font-bold uppercase tracking-widest shadow-xl shadow-cyan-500/20 hover:bg-cyan-400 hover:scale-[1.02] transition-all">Authorize Final Dispatch</button>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card title="Intelligence Vector">
                            {loadingInsights ? (
                                <div className="space-y-4 animate-pulse">
                                    <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                                    <div className="h-4 bg-slate-800 rounded w-full"></div>
                                    <div className="h-4 bg-slate-800 rounded w-2/3"></div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {aiInsights.map((insight, idx) => (
                                        <div key={idx} className="flex items-start">
                                            <i className="fas fa-lightbulb text-yellow-500 mr-3 mt-1 text-sm"></i>
                                            <p className="text-xs text-slate-400 leading-relaxed">{insight}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            )}

            {currentStep === 3 && (
                <div className="max-w-xl mx-auto py-12 animate-in zoom-in-95 duration-700">
                    <Card className="text-center py-12 px-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-green-500"></div>
                        <div className="w-24 h-24 bg-green-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(34,197,94,0.1)]">
                             <i className="fas fa-check text-4xl text-green-500"></i>
                        </div>
                        <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Transmission Verified</h2>
                        <p className="text-slate-400 mb-8 font-medium">Assets successfully dispatched via {paymentMethod.toUpperCase()} rail.</p>
                        
                        <div className="p-6 bg-slate-950 rounded-[2rem] border border-slate-800 mb-8 text-left space-y-3 font-mono">
                            <div className="flex justify-between text-[10px]">
                                <span className="text-slate-600">DLT_HASH</span>
                                <span className="text-cyan-500">0x{Math.random().toString(16).substr(2, 24)}...</span>
                            </div>
                            <div className="flex justify-between text-[10px]">
                                <span className="text-slate-600">TX_IDENTITY</span>
                                <span className="text-slate-300">RTX-{Date.now()}</span>
                            </div>
                            <div className="flex justify-between text-[10px]">
                                <span className="text-slate-600">STABILITY</span>
                                <span className="text-green-400">NOMINAL_CONSENSUS</span>
                            </div>
                        </div>

                        <button onClick={() => setActiveView(View.Dashboard)} className="w-full py-5 rounded-3xl bg-slate-900 text-white font-bold uppercase tracking-widest border border-slate-800 hover:bg-slate-800 transition-all">Return to Nexus</button>
                    </Card>
                </div>
            )}

            <BiometricModal
                isOpen={showBiometricModal}
                onSuccess={handleFinalSuccess}
                onClose={() => setShowBiometricModal(false)}
                amount={amount}
                recipient={selectedRecipient || searchTerm}
                paymentMethod={paymentMethod}
                securityContext="personal"
            />
        </div>
    );
};

export default SendMoneyView;
