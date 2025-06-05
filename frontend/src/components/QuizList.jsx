// // components/QuizTakePage.jsx
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import api from './api';

// export default function QuizList() {
//   const { id } = useParams();
//   const [quiz, setQuiz] = useState(null);
//   const [answers, setAnswers] = useState([]);
//   const [score, setScore] = useState(null);
//   const [submitted, setSubmitted] = useState(false);

//   useEffect(() => {
//     const fetchQuiz = async () => {
//       try {
//         const res = await api.get(`/api/quizzes/${id}`);
//         setQuiz(res.data);
//         setAnswers(new Array(res.data.questions.length).fill(null));
//       } catch (err) {
//         alert('Failed to load quiz');
//       }
//     };
//     fetchQuiz();
//   }, [id]);

//   const handleChange = (questionIndex, selectedOption) => {
//     const updatedAnswers = [...answers];
//     updatedAnswers[questionIndex] = selectedOption;
//     setAnswers(updatedAnswers);
//   };

//   const handleSubmit = async () => {
//     try {
//       const res = await api.post(`/api/quizzes/${id}/answer`, { answers });
//       setScore(res.data.score);
//       setSubmitted(true);
//     } catch (err) {
//       alert('Submission failed');
//     }
//   };

//   if (!quiz) return <div className="p-4 text-center">Loading quiz...</div>;

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
//       <p className="text-gray-700 mb-6">{quiz.description}</p>

//       {quiz.questions.map((q, idx) => (
//         <div key={idx} className="mb-6 border-b pb-4">
//           <p className="font-semibold mb-2">{idx + 1}. {q.questionText}</p>
//           <div className="space-y-2">
//             {q.options.map((opt, optIdx) => (
//               <label key={optIdx} className="block">
//                 <input
//                   type="radio"
//                   name={`question-${idx}`}
//                   value={optIdx}
//                   disabled={submitted}
//                   checked={answers[idx] === optIdx}
//                   onChange={() => handleChange(idx, optIdx)}
//                   className="mr-2"
//                 />
//                 {opt}
//               </label>
//             ))}
//           </div>
//         </div>
//       ))}

//       {!submitted ? (
//         <button
//           onClick={handleSubmit}
//           className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
//         >
//           Submit Quiz
//         </button>
//       ) : (
//         <div className="mt-6 text-lg font-medium text-green-700">
//           ✅ You scored {score} out of {quiz.questions.length}
//         </div>
//       )}
//     </div>
//   );
// }
import React from 'react'

const QuizList = () => {
  return (
    <div>
        this is quiz list
      
    </div>
  )
}

export default QuizList
