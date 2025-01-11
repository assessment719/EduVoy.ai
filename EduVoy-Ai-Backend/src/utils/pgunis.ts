export interface PgUnis {
    id: number,
    universityId: number,
    universityName: string,
    academicReq: object,
    englishReq: object,
    moiUniversities: [Number],
    ieltsReq: object,
    pteReq: object,
    toeflReq: object,
    duolingoReq: object,
    mathReq: object,
    placementCourses: string,
    topupCourses: string,
    resCourses: string,
    fees: number,
    extraReqInfo: string
  }