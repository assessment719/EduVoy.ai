import { atom } from 'recoil';

export const isFetchingAtom = atom({
    key: 'isFetching',
    default: false
});

export const stateOfChangesAtom = atom({
    key: 'stateOfChanges',
    default: ''
});

export const isActionedAtom = atom({
    key: 'isActioned',
    default: false
});

export const inActionUniIdAtom = atom({
    key: 'inActionUniId',
    default: 0
});