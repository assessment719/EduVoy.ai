import { FileText, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { Resource } from './../../../Utils/resource';
import { BACKEND_URL } from './../../../config';
import { useEffect, useState } from 'react';
import LoaderComponent from './../../loader';

const ResourceCenter = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [resources, setResources] = useState<Resource[]>([]);

  const fetchResources = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        return;
      }
      await new Promise((e) => { setTimeout(e, 1000) })
      const response = await fetch(`${BACKEND_URL}/users/resources`, {
        method: "GET",
        headers: {
          'token': `${token}`
        },
      });
      const data: { resources: Resource[] } = await response.json();
      setResources(data.resources);
      setIsFetching(false);
    } catch (error) {
      console.error('Error fetching resources:', error);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    setIsFetching(true);
    fetchResources();
  }, [])

  return (
    <>
      {isFetching && <div className='fixed w-full h-full'>
        <div className='flex justify-center -mt-28 -ml-80'>
          <LoaderComponent />
        </div>
      </div>}

      {!isFetching && <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-green-200 rounded-lg">
                  <FileText className="w-6 h-6 text-black" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-xl mb-2">{resource.title}</h3>
                  <p className="text-lg text-gray-600 mb-4">{resource.category}</p>
                  <div className="flex items-center space-x-2">
                    <Download className="w-4 h-4 text-green-200" />
                    <a
                      href={resource.downloadUrl}
                      className="text-green-200 text-lg hover:underline"
                    >
                      Download Resource
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Recommendations To Preapare For Interviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-lg">
              <h3 className="font-semibold mb-2">Financial Documentation Guide</h3>
              <p className="text-sm opacity-90">Improve your understanding of required financial documents and how to present them effectively.</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-lg">
              <h3 className="font-semibold mb-2">Future Plans Workshop</h3>
              <p className="text-sm opacity-90">Learn how to articulate your post-graduation plans and career objectives clearly.</p>
            </div>
          </div>
        </div>
      </div>}
    </>
  );
};

export default ResourceCenter;