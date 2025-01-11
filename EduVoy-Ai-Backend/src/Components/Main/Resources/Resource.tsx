import { FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Resource } from './../../../utils/resources';
import { BACKEND_URL } from './../../../config';
import LoaderComponent from '../../loader';

const ResourceCentre: React.FC = () => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('');
    const [category, setCategory] = useState('');
    const [downloadUrl, setDownloadUrl] = useState('');
    const [isFetching, setIsFetching] = useState(false);

    const [resources, setResources] = useState<Resource[]>([]);
    const [numberOfResources, setNumberOfResources] = useState(0);
    const [numberOfUpdatingResource, setNumberOfUpdatingResource] = useState(0);
    const [isResourceToUpdated, setIsResourceToUpdated] = useState(false);

    // Get Resources
    const fetchResources = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                return;
            }
            await new Promise((e) => { setTimeout(e, 1200) })
            const response = await fetch(`${BACKEND_URL}/admin/resources`, {
                method: "GET",
                headers: {
                    'token': `${token}`
                },
            });
            const data: { resources: Resource[] } = await response.json();
            setResources(data.resources);
            setNumberOfResources(data.resources.length);
            setIsFetching(false);
        } catch (error) {
            console.error('Error fetching resources:', error);
            setIsFetching(false);
        }
    };

    useEffect(() => {
        setIsFetching(true);
        fetchResources();
    }, []);

    const resetForm = () => {
        setTitle('');
        setType('');
        setCategory('');
        setDownloadUrl('');
        fetchResources();
    }

    // Update Resource
    const inputSectionRef = useRef<HTMLDivElement | null>(null);
    const topSectionRef = useRef<HTMLDivElement | null>(null);

    const handleScrollToInputSection = () => {
        inputSectionRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    const handleScrollToTopSection = () => {
        topSectionRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    const goToUpadteResource = (idx: number) => {
        const idOfResource = idx - 1;
        setNumberOfUpdatingResource(idx);

        handleScrollToInputSection();

        setTitle(`${resources[idOfResource].title}`);
        setType(`${resources[idOfResource].type}`);
        setCategory(`${resources[idOfResource].category}`);
        setDownloadUrl(`${resources[idOfResource].downloadUrl}`);
        setIsResourceToUpdated(true);
    }

    const updateResource = () => {
        setIsFetching(true);
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        if (title && type !== 'all' && category && downloadUrl) {
            fetch(`${BACKEND_URL}/admin/resources/update`, {
                method: "PUT",
                headers: {
                    'token': `${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: numberOfUpdatingResource, title, type, category, downloadUrl }),
            })
                .then(async (res) => {
                    if (!res.ok) {
                        setIsFetching(false);
                        throw new Error("Failed to fetch data");
                    }
                    handleScrollToTopSection();
                    resetForm();
                    setIsResourceToUpdated(false);
                })
                .catch((error) => console.error("Error fetching resources:", error));
        } else {
            alert('Please fill in all fields before submitting.');
            setIsFetching(false);
            return
        }
    }

    // Delete Resource
    const deleteResource = (idx: number) => {
        setIsFetching(true);
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        fetch(`${BACKEND_URL}/admin/resources/delete`, {
            method: "DELETE",
            headers: {
                'token': `${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: idx }),
        })
            .then(async (res) => {
                if (!res.ok) {
                    setIsFetching(false);
                    throw new Error("Failed to fetch data");
                }
                resetForm();
            })
            .catch((error) => console.error("Error fetching resources:", error));
    }

    // Add Resource
    const addResource = () => {
        setIsFetching(true);
        const token = localStorage.getItem('token');

        if (!token) {
            return;
        }

        if (title && type !== 'all' && category && downloadUrl) {
            let newId = numberOfResources + 1;

            fetch(`${BACKEND_URL}/admin/resources/add`, {
                method: "POST",
                headers: {
                    'token': `${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: newId, title, type, category, downloadUrl }),
            })
                .then(async (res) => {
                    if (!res.ok) {
                        setIsFetching(false);
                        throw new Error("Failed to fetch data");
                    }
                    handleScrollToTopSection();
                    resetForm();
                })
                .catch((error) => console.error("Error fetching resources:", error));
        } else {
            alert('Please fill in all fields before submitting.');
            setIsFetching(false);
            return
        }
    }

    return (
        <>
            {isFetching && <div className='fixed w-full h-full'>
                <div className='flex justify-center -mt-20 -ml-80'>
                    <LoaderComponent />
                </div>
            </div>}
            {!isFetching && <div className="max-w-7xl mx-auto p-6 -mt-6">
                <div className="grid grid-cols-1 gap-6 w-[1100px]">
                    {resources.map((resource, index) =>
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-500"
                        >
                            <div ref={topSectionRef} className="flex items-start space-x-4 mb-5">
                                <div className="p-3 bg-green-200 rounded-lg">
                                    <FileText className="w-6 h-6 text-black" />
                                </div>
                                <div className="flex-1 mt-3">
                                    <b className="font-bold text-xl mb-2">{resource.id}. {resource.title}</b><br /><br />
                                    <p className="font-light text-xl mb-2"><b className="font-bold text-lg mb-2">Resource Type:</b> {resource.type}</p>
                                    <p className="font-light text-xl mb-2"><b className="font-bold text-lg mb-2">Resource Category:</b> {resource.category}</p>
                                    <p className="font-light text-xl mb-2"><b className="font-bold text-lg mb-2">Resource Download Link:</b> {resource.downloadUrl}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={() => goToUpadteResource(resource.id)}

                                    className="w-full btn btn-primary"
                                >
                                    Update Resource
                                </motion.button>
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    onClick={() => deleteResource(resource.id)}
                                    className="w-full btn btn-primary"
                                >
                                    Delete Resource
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </div>

                <div ref={inputSectionRef} className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 mt-8 text-white w-[1100px]">
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-4'>
                        <div className="mb-4">
                            <label htmlFor="title" className="block font-bold text-xl text-white mb-1">
                                Resource Title:
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter Title"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="difficulty" className="block font-bold text-xl text-white mb-1">
                                Resource Type:
                            </label>
                            <select
                                id="difficulty"
                                value={type}
                                onChange={e => setType(e.target.value)}
                                className="w-full border border-black text-black rounded-lg h-10"
                            >
                                <option value="all">Select An Option</option>
                                <option value="Document">Document</option>
                                <option value="Video">Video</option>
                                <option value="Audio">Audio</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="category" className="block font-bold text-xl text-white mb-1">
                                Resource Category:
                            </label>
                            <input
                                type="text"
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="Enter Category Of The Resource"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="downloadUrl" className="block font-bold text-xl text-white mb-1">
                                Resource Download Link:
                            </label>
                            <input
                                type="text"
                                id="downloadUrl"
                                value={downloadUrl}
                                onChange={(e) => setDownloadUrl(e.target.value)}
                                placeholder="Enter Download Link"
                                className="p-2 w-full border border-black text-black rounded-lg"
                            />
                        </div>
                    </div>
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={isResourceToUpdated ? updateResource : addResource}
                        className="w-full btn btn-primary bg-gradient-to-r from-red-500 to-green-600"
                    >
                        {isResourceToUpdated ? "Update Resource" : "Add Resource"}
                    </motion.button>
                </div>
            </div>}
        </>
    )
};

export default ResourceCentre;