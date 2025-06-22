import { atom } from 'recoil';

export const isTestSelecteedAtom = atom({
    key: 'isTestSelecteed',
    default: false
});

export const testNameAtom = atom({
    key: 'testName',
    default: ''
});