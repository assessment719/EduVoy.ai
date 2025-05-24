import { useRecoilValue } from 'recoil';
import { isSubmitedAtom } from './atoms';
import InterviewHome from './InterviewHome';
import InterviewRoom from './InterviewRoom';

function ProHead() {
    const isSubmitted = useRecoilValue(isSubmitedAtom);

    return (
        <>
            {isSubmitted ? (
                <InterviewRoom />
            ) : (
                <InterviewHome />
            )}
        </>
    )
}

export default ProHead;