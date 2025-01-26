import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import { ConnectedUsers } from './../utils/connectedUsers';
import { PendingMessages } from './../utils/pendingMessages';

const { persistAtom } = recoilPersist();

export const fullNameAtom = atom({
    key: 'fullName',
    default: '',
    effects_UNSTABLE: [persistAtom],
});

export const allConnectedUsersAtom = atom({
    key: 'allConnectedUsers',
    default: [] as ConnectedUsers[]
});

export const pendingMessagesAtom = atom({
    key: 'pendingMessages',
    default: [] as PendingMessages[]
});

export const currentRoomAtom = atom({
    key: 'currrentRoom',
    default: '',
    effects_UNSTABLE: [persistAtom],
});

export const currentUserNameAtom = atom({
    key: 'currentUserName',
    default: ''
});

export const isChatingAtom = atom({
    key: 'isChating',
    default: false
});

export const previousAdminRoomAtom = atom({
    key: 'previousAdminRoom',
    default: [] as ConnectedUsers[]
});

export const previousUserRoomAtom = atom({
    key: 'previousUserRoom',
    default: [] as string[]
});