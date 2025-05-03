export type queryStatus = 'answered' | 'notAnswered';

export interface Querry {
    id: number;
    fullName: string;
    email: string;
    phoneNo: string;
    subject: string;
    message: string;
    status: queryStatus;
    answer: string;
    createdAt: Date;
    updatedAt: Date;
}