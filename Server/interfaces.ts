import { WebSocket } from "ws";

export interface ConnectedUsers {
    userName: string;
    socket: WebSocket;
    roomId: string;
}

export interface ConnectedAdmins {
    socket: WebSocket;
    roomId: string;
}

export interface PendingMessages {
    message: string;
    roomId: string;
}

export interface University {
    id: number;
    universityName: string;
    location: string;
    logoLink: string;
    universityWebsitePage: string;
    universityCoursePage: string;
    globalRanking: string;
    accreditation: string;
    tutionFees: string;
    scholarships: string;
    researchFacilities: string;
    livingCost: string;
    jobPlacementRate: string;
    averageSalary: string;
    studentReview: string;
}

export interface Course {
    id: number,
    courseName: string,
    universityName: string,
    duration: string,
    modeOfStudy: string,
    applicationFees: number,
    fees: number,
    scholarship: string,
    courseModules: string,
    placementAvailability: string,
    carrer: string
}