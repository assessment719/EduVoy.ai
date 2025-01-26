import { atom } from 'recoil';

export const isFetchingAtom = atom({
    key: 'isPgFetching',
    default: false
});

export const stateOfChangesAtom = atom({
    key: 'PgstateOfChanges',
    default: ''
});

export const isActionedAtom = atom({
    key: 'isPgActioned',
    default: false
});

export const inActionUniIdAtom = atom({
    key: 'inPgActionUniId',
    default: 0
});