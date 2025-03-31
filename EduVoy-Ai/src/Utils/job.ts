export interface JobsType {
    id: number;
    title: string;
    avgHourlyRate: string;
    hoursPerWeek: string;
    locations: [string];
    requirements: [string];
    benefits: [string];
    tips: string;
}