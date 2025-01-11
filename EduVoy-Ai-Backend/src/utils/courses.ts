export interface Course {
    id: number;
    universityId: number;
    courseName: string;
    courseType: string;
    universityName: string;
    campus: string;
    duration: string;
    fees: number;
    intakes: [Number];
    faculties: [Number];
  }