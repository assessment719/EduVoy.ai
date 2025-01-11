import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import * as Tabs from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';
import { University, LucideMessageCircleQuestion, FileText, Settings, ArrowRight, Book } from 'lucide-react';
import { fullNameAtom } from '../Atoms/atoms';
import { useNavigate } from 'react-router-dom';
import { isActionedAtom } from './../Components/Main/Postgraduate/Atoms';
import { isUgActionedAtom } from './../Components/Main/Undergraduate/Atoms';
import QuestionCentre from './Main/Questions/Questionnaire';
import ResourceCentre from './Main/Resources/Resource';
import OptionCentre from './Main/Options/Option';
import CourseCentre from './Main/Courses/Courses';
import PgUniversities from './Main/Postgraduate/PgUniversities';
import UgUniversities from './Main/Undergraduate/UgUniversities';


function Hero() {
  const [activeTab, setActiveTab] = useState('pgunis');
  const [activeTabTitle, setActiveTabTitle] = useState('');
  const setIsActioned = useSetRecoilState(isActionedAtom);
  const setIsUgActioned = useSetRecoilState(isUgActionedAtom);
  const fullName = useRecoilValue(fullNameAtom);
  const setFullName = useSetRecoilState(fullNameAtom);
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === 'pgunis') {
      setActiveTabTitle("Postgraduate Universities");
    } else if (activeTab === 'ugunis') {
      setActiveTabTitle("Undergraduate Universities");
    } else if (activeTab === 'courses') {
      setActiveTabTitle("Courses");
    } else if (activeTab === 'questions') {
      setActiveTabTitle("Interview Questionnaire");
    } else if (activeTab === 'resources') {
      setActiveTabTitle("Interview Resources");
    } else {
      setActiveTabTitle("Options");
    }

    if (activeTab !== 'pgunis') {
      setIsActioned(false);
    }

    if (activeTab !== 'ugunis') {
      setIsUgActioned(false);
    }
  }, [activeTab]);

  function signOut() {
    localStorage.removeItem('token');
    setFullName('');
    navigate('/admin/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-b from-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <img className="w-36" src="https://i.postimg.cc/G2Gdrhxb/logopng.png" />
          <h1 className="text-3xl font-bold">{activeTabTitle}</h1>
          <div className="flex justify-around w-44 border-2 border-black p-1 rounded-2xl shadow-lg">
            <img className="w-10 border-2 border-black rounded-xl" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtuphMb4mq-EcVWhMVT8FCkv5dqZGgvn_QiA&s" />
            <div>
              <h4 className="font-bold">{fullName}</h4>
              <button onClick={() => signOut()} className="text-red-500 font-semibold flex justify-center">
                <p>Sign Out</p>
                <ArrowRight className="w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <div>
        <main>
          <Tabs.Root className="flex flex-row justify-start mt-3" value={activeTab} onValueChange={setActiveTab}>
            <Tabs.List className="bg-gray-200 rounded-r-2xl h-fit mr-5">
              {[
                { id: 'pgunis', label: 'PG Universities', icon: University },
                { id: 'ugunis', label: 'UG Universities', icon: University },
                { id: 'courses', label: 'Courses', icon: Book },
                { id: 'questions', label: 'Questions', icon: LucideMessageCircleQuestion },
                { id: 'resources', label: 'Resources', icon: FileText },
                { id: 'options', label: 'Options', icon: Settings },
              ].map(({ id, label, icon: Icon }) => (
                <Tabs.Trigger
                  key={id}
                  value={id}
                  className={`
                  w-56 flex-1 px-4 py-2 font-bold flex items-center justify-start space-x-2 
                  rounded-lg transition-colors duration-200 cursor-pointer m-3
                  ${activeTab === id
                      ? 'bg-green-200 text-white'
                      : 'hover:bg-white'
                    }
                `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Tabs.Content value="pgunis">
                <PgUniversities />
              </Tabs.Content>

              <Tabs.Content value="ugunis">
                <UgUniversities />
              </Tabs.Content>

              <Tabs.Content value="courses">
                <CourseCentre />
              </Tabs.Content>

              <Tabs.Content value="questions">
                <QuestionCentre />
              </Tabs.Content>

              <Tabs.Content value="resources">
                <ResourceCentre />
              </Tabs.Content>

              <Tabs.Content value="options">
                <OptionCentre />
              </Tabs.Content>
            </motion.div>
          </Tabs.Root>
        </main>
      </div>
    </div>
  )
}

export default Hero
