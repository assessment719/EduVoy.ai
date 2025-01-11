import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const fullNameAtom = atom({
    key: 'fullName',
    default: '',
    effects_UNSTABLE: [persistAtom],
});

export const signAtom = atom({
    key: 'sign',
    default: 'up',
    effects_UNSTABLE: [persistAtom],
});