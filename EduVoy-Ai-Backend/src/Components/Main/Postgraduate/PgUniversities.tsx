import { motion } from 'framer-motion';
import Select from 'react-dropdown-select';
import { useState, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { inActionUniIdAtom, stateOfChangesAtom, isActionedAtom, isFetchingAtom } from './Atoms';
import { PgUnis } from './../../../utils/pgunis';
import { Dropdown } from './../../../utils/dropdown';
import { EnglandUniversities } from './../../../utils/ukuniversities';
import Action from './Actions';
import LoaderComponent from '../../loader';
import { BACKEND_URL } from './../../../config';

const PgUniversities: React.FC = () => {

    const setAddingfUniId = useSetRecoilState(inActionUniIdAtom);
    const setState = useSetRecoilState(stateOfChangesAtom);
    const setIsActioned = useSetRecoilState(isActionedAtom);
    const setIsFetching = useSetRecoilState(isFetchingAtom);
    const isActioned = useRecoilValue(isActionedAtom);
    const isFetching = useRecoilValue(isFetchingAtom);
    const universityId = useRecoilValue(inActionUniIdAtom);

    // Set Of Options
    const [toBeAddedunis, setToBeAddedunis] = useState<Dropdown[]>([]);
    const [uniOptions, setUniOption] = useState<number[]>([]);
    const [pgUniOptions, setPgUniOptions] = useState<number[]>([]);

    // Set Of objects
    const [objUnisName, setObjUnisName] = useState<{ [key: number]: string }>({});
    const [objUnisImg, setObjUnisImg] = useState<{ [key: number]: string }>({});
    const [objUnisAdd, setObjUnisAdd] = useState<{ [key: number]: string }>({});

    // Set Of Added Universities
    const [pgUnis, setPgUnis] = useState<PgUnis[]>([]);

    const fetchUnis = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }
            const response = await fetch(`${BACKEND_URL}/admin/finaluniversities`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const res = await response.json();
            const data = res.data;

            let obj: { [key: number]: string } = {};
            data.universities.forEach((uni: EnglandUniversities) => {
                obj[uni.id] = uni.universityName;
            });
            setObjUnisName(obj);

            let imgObj: { [key: number]: string } = {};
            data.universities.forEach((uni: EnglandUniversities) => {
                imgObj[uni.id] = uni.logoLink;
            });
            setObjUnisImg(imgObj);

            let addObj: { [key: number]: string } = {};
            data.universities.forEach((uni: EnglandUniversities) => {
                addObj[uni.id] = uni.location;
            });
            setObjUnisAdd(addObj);

            let options = [];
            options.push(...data.universities.map((obj: EnglandUniversities) => (obj.id)));
            setUniOption(options);
        } catch (error) {
            console.error('Error fetching unis:', error);
        }
    };

    const fetchPgUnis = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }
            const response = await fetch(`${BACKEND_URL}/admin/universities/pguniversities`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const data: { pgUniversities: PgUnis[] } = await response.json();
            setPgUnis(data.pgUniversities);

            let options = [];
            options.push(...data.pgUniversities.map(obj => (obj.universityId)));
            setPgUniOptions(options);
        } catch (error) {
            console.error('Error fetching unis:', error);
        }
    };

    function listToBeAddedUnis() {
        let toBeAddedUnis: Dropdown[] = [];
        uniOptions.forEach(uni => {
            if (!pgUniOptions.includes(uni as number)) {
                toBeAddedUnis.push({
                    value: uni,
                    label: objUnisName[uni as number]
                });
            }
        });
        setToBeAddedunis(toBeAddedUnis);
        setTimeout(() => {
            setIsFetching(false);
        }, 1200)
    }

    function switchAddState() {
        if (universityId !== 0) {
            setState('adding');
            setIsActioned(true);
        } else {
            alert('Please Select An University To Add');
            return
        }
    }

    function switchUpdateState(idx: number) {
        setState('updating');
        setIsActioned(true);
        setAddingfUniId(idx);
    }

    useEffect(() => {
        fetchUnis();
        fetchPgUnis();
    }, []);

    useEffect(() => {
        if (!isActioned) {
            fetchPgUnis();
        }
    }, [isActioned]);

    useEffect(() => {
        listToBeAddedUnis();
    }, [pgUniOptions]);

    function deleteUniReq(idx: number) {
        setIsFetching(true);
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        fetch(`${BACKEND_URL}/admin/universities/pguniversities/delete`, {
            method: "DELETE",
            headers: {
                'token': `${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ universityId: idx }),
        })
            .then(async (res) => {
                if (!res.ok) {
                    setIsFetching(false);
                    throw new Error("Failed to fetch data");
                }
                fetchPgUnis();
            })
            .catch((error) => console.error("Error fetching course:", error));
    }

    return (
        <>
            {isFetching && <div className='fixed w-full h-full flex justify-center'>
                <div className='flex justify-center -mt-20 -ml-80'>
                    <LoaderComponent />
                </div>
            </div>}

            {!isFetching && !isActioned && <div className="max-w-7xl mx-auto p-6 -mt-6">
                <div className='flex justify-center'>
                    <div className="flex justify-around items-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-5 mb-8 text-white w-[1100px]">
                        <div className='w-[700px]'>
                            <label htmlFor="type" className="block font-bold text-xl text-white mb-1">
                                Select A University To Add Requirements:
                            </label>
                            <Select
                                className='w-96 bg-white text-black h-10 text-2xl'
                                name='university'
                                color='#8bb87b'
                                placeholder='Select University'
                                closeOnClickInput
                                values={[]}
                                options={toBeAddedunis}
                                onChange={(value: Dropdown[]): void => { setAddingfUniId(value[0].value) }}
                            />
                        </div>

                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={switchAddState}
                            className="w-52 h-12 btn btn-primary bg-gradient-to-r from-red-500 to-green-600"
                        >
                            Add University
                        </motion.button>
                    </div>
                </div>
                <div className='flex flex-col items-center gap-6'>
                    {pgUnis.map((uni, index) =>
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="w-[700px] bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-500"
                        >
                            <div className="flex justify-around items-center space-x-4">
                                <div className='rounded-xl border-2 border-black overflow-hidden '>
                                    <img src={objUnisImg[uni.universityId]} className='object-cover w-24 h-20' />
                                </div>
                                <div className="flex-1 mt-3">
                                    <b className="font-bold text-xl mb-3">{uni.universityName}</b>
                                    <br />
                                    <p className="text-lg mb-3">{objUnisAdd[uni.universityId]}</p>
                                </div>
                                <div className='flex flex-col gap-3'>
                                    <button onClick={() => switchUpdateState(uni.universityId)} className='btn btn-primary'>View & Update</button>
                                    <button onClick={() => deleteUniReq(uni.universityId)} className='btn btn-primary'>Delete</button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>}

            {isActioned && <Action />}
        </>
    )
}

export default PgUniversities