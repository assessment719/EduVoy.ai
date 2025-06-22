import { useRecoilValue } from 'recoil';
import { isTestSelecteedAtom } from './atoms';
import EnglishTestHome from './Home';
import EnglishTestRoom from './TestRoom/Home';

function EnglishTestHead() {
    const isSubmitted = useRecoilValue(isTestSelecteedAtom);

    return (
        <>
            {isSubmitted ? (
                <EnglishTestRoom />
            ) : (
                <EnglishTestHome />
            )}
        </>
    )
}

export default EnglishTestHead;