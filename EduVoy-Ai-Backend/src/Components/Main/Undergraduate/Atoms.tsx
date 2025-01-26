import { atom } from 'recoil';

export const isFetchingAtom = atom({
    key: 'isUgFetching',
    default: false
});

export const stateOfChangesAtom = atom({
    key: 'UgstateOfChanges',
    default: ''
});

export const isUgActionedAtom = atom({
    key: 'isUgActioned',
    default: false
});

export const inActionUniIdAtom = atom({
    key: 'inUgActionUniId',
    default: 0
});