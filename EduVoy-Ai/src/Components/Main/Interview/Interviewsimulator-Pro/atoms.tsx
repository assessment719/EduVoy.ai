import { atom } from 'recoil';

export const destinationCountryAtom = atom({
    key: 'destinationCountryAtom',
    default: ''
});

export const universityNameAtom = atom({
    key: 'universityName',
    default: ''
});

export const courseNameAtom = atom({
    key: 'courseName',
    default: ''
});

export const intakeMonthAtom = atom({
    key: 'intakeMonthAtom',
    default: ''
});

export const interviewerAtom = atom({
    key: 'interviewer',
    default: ''
});

export const isSubmitedAtom = atom({
    key: 'isSubmited',
    default: false
});

//Transcript and Feedback
export const transcriptAtom = atom({
    key: 'transcript',
    default: [] as { id: number, speaker: 'ai' | 'user'; text: string }[]
});

export const clarityOfResponsesAtom = atom({
    key: 'clarityOfResponses',
    default: 0
});

export const confidenceLevelAtom = atom({
    key: 'confidenceLevel',
    default: 0
});

export const questionComprehensionAtom = atom({
    key: 'questionComprehension',
    default: 0,
});

export const isGivenIntroAtom = atom({
    key: 'isGivenIntro',
    default: false,
});

export const currentQuestionAtom = atom({
    key: 'currentQuestion',
    default: 0
});