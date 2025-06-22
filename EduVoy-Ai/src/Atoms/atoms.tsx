import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import { expensesType } from './../Utils/expenses';
import { incomesType } from './../Utils/incomes';
import { loanType } from './../Utils/loan';
import { englishTests } from './../Utils/englishTest';

const { persistAtom } = recoilPersist();

export const userDetailsAtom = atom({
    key: 'userDetails',
    default: {},
    effects_UNSTABLE: [persistAtom],
});

export const signAtom = atom({
    key: 'sign',
    default: 'up',
    effects_UNSTABLE: [persistAtom],
});

export const activeTabAtom = atom({
    key: 'activeTab',
    default: 'university',
});

export const chatBoxStateAtom = atom({
    key: 'chatBoxState',
    default: false
});

export const currentRoomAtom = atom({
    key: 'currrentRoom',
    default: '',
    effects_UNSTABLE: [persistAtom],
});

export const dreamUniAtom = atom({
    key: 'addedToUniList',
    default: {} as { [key: number]: boolean }
});

export const dreamCourseAtom = atom({
    key: 'addedToCourseList',
    default: {} as { [key: number]: boolean }
});

export const expensesAtom = atom({
    key: 'expenses',
    default: {} as expensesType
});

export const incomesAtom = atom({
    key: 'incomes',
    default: {} as incomesType
});

export const loanAtom = atom({
    key: 'loan',
    default: {} as loanType
});

export const scholarshipListAtom = atom({
    key: 'scholarshipList',
    default: {} as { [key: number]: boolean }
});

export const loanListAtom = atom({
    key: 'loanList',
    default: {} as { [key: number]: boolean }
});

export const jobListAtom = atom({
    key: 'jobList',
    default: {} as { [key: number]: boolean }
});

export const englishTestsAtom = atom({
    key: 'englishTests',
    default: {} as englishTests
})