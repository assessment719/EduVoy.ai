export interface LoansType {
    id: number;
    title: string;
    bankName: string;
    interestRate: string;
    maxAmount: string;
    collateral: string;
    features: [string];
    eligibility: [string];
    tenure: string;
    processingFee: string;
    link: string;
}