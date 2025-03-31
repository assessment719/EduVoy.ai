export interface ScholarshipsType {
    id: number;
    title: string;
    provider: string;
    type: string;
    amount: string;
    deadline: string;
    eligibilities: [string];
    requirements: [string];
    faculties: [string];
    link: string;
}