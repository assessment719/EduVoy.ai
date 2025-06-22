import { CheckCircle } from 'lucide-react';
import { useRecoilValue } from 'recoil';
import { englishTestsAtom } from './../../../../Atoms/atoms';
import type { englishTests } from '../../../../Utils/englishTest';

interface TestSelectorProps {
  selectedTest: string | null;
  onTestSelect: (test: string) => void;
}

const TestSelector: React.FC<TestSelectorProps> = ({ selectedTest, onTestSelect }) => {
  const englishTests = useRecoilValue(englishTestsAtom);

  const tests = [
    {
      id: 'ielts',
      name: 'IELTS',
      fullName: 'International English Language Testing System',
      description: 'For UK, Australia, Canada immigration and university admissions',
      duration: '2 Hours 45 Minutes',
      sections: ['Listening', 'Reading', 'Writing', 'Speaking'],
      difficulty: 'Intermediate',
      color: 'bg-blue-100',
      borderColor: 'border-blue-300',
      textColor: 'text-blue-700',
      popularity: 'Most Popular'
    },
    {
      id: 'toefl',
      name: 'TOEFL',
      fullName: 'Test of English as a Foreign Language',
      description: 'Primarily for US university admissions and academic purposes',
      duration: '1 Hour 56 Minutes (TOEFL iBT)',
      sections: ['Reading', 'Listening', 'Speaking', 'Writing'],
      difficulty: 'Advanced',
      color: 'bg-green-100',
      borderColor: 'border-green-300',
      textColor: 'text-green-700',
      popularity: 'Academic Focus'
    },
    {
      id: 'pte',
      name: 'PTE',
      fullName: 'Pearson Test of English Academic',
      description: 'Accepted globally for immigration and university admissions',
      duration: '2 Hours',
      sections: ['Speaking & Writing', 'Reading', 'Listening'],
      difficulty: 'Intermediate to Advanced',
      color: 'bg-purple-100',
      borderColor: 'border-purple-300',
      textColor: 'text-purple-700',
      popularity: 'Computer-Based Precision'
    },
    {
      id: 'duolingo',
      name: 'Duolingo',
      fullName: 'Duolingo English Test',
      description: 'Quick, convenient, and affordable English proficiency test',
      duration: '1 Hour',
      sections: ['Adaptive Test', 'Video Interview', 'Writing Sample'],
      difficulty: 'Beginner to Intermediate',
      color: 'bg-orange-100',
      borderColor: 'border-orange-300',
      textColor: 'text-orange-700',
      popularity: 'Quick & Easy'
    }
  ];

  return (
    <div className="grid place-items-center md:grid-cols-1 lg:grid-cols-2 gap-y-10 mb-10 px-5">
      {tests.map((test, index) => (
        <div
          key={test.id}
          className={`w-[80%] relative rounded-lg shadow-md p-6 cursor-pointer transition-all duration-300
            hover:shadow-lg hover:-translate-y-1 hover:scale-105
            ${selectedTest === test.id
              ? `ring-2 ring-blue-500 ${test.color} ${test.borderColor} border-2`
              : 'bg-white border-2 border-gray-200 hover:border-gray-300'
            }
          `}
          onClick={() => onTestSelect(test.id)}
        >
          {(
            englishTests[test.id as keyof typeof englishTests].currentDate !== 0 ||
            englishTests[test.id as keyof typeof englishTests].currentTask !== 0 ||
            englishTests[test.id as keyof typeof englishTests].studyTiming !== '00:00'
          ) && (
              <div className={`absolute top-4 left-4 px-2 border-2 ${tests[index].color} ${tests[index].borderColor} rounded-xl text-sm font-semibold`}>
                {englishTests[test.id as keyof typeof englishTests].currentDate === 30 ? 'Completed' : 'Ongoing'}
              </div>
            )}

          {/* Check Circle Icon - Top Right Corner */}
          {selectedTest === test.id && (
            <div className="absolute top-4 right-4">
              <CheckCircle className="w-7 h-7 text-blue-500" />
            </div>
          )}

          <div className="flex flex-col items-center text-center h-full">
            {/* Test Name */}
            <h3 className={`text-2xl font-bold mb-2 ${test.textColor}`}>
              {test.name}
            </h3>

            {/* Popularity Badge */}
            <div className={`px-3 py-1 rounded-full text-sm font-medium mb-3 ${test.color} ${test.textColor}`}>
              {test.popularity}
            </div>

            {/* Full Name */}
            <h4 className="text-xl font-medium text-gray-800 mb-2 leading-tight">
              {test.fullName}
            </h4>

            {/* Description */}
            <p className="text-lg max-w-[80%] text-gray-600 mb-4 flex-grow">
              {test.description}
            </p>

            {/* Test Details */}
            <div className="w-full space-y-2 text-lg">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Duration:</span>
                <span className="text-gray-600">{test.duration}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Difficulty:</span>
                <span className="text-gray-600">{test.difficulty}</span>
              </div>

              {/* Sections */}
              <div className="pt-2">
                <span className="text-lg font-medium text-gray-700 block mb-2">Sections:</span>
                <div className="flex flex-wrap gap-1 justify-center">
                  {test.sections.map((section, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm border"
                    >
                      {section}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TestSelector;