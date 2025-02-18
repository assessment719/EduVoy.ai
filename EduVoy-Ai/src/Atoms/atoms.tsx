import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

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