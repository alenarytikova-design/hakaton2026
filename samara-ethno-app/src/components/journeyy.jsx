import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Импортируем магию

function OrnamentConstructor({ elements }) {
    const [canvas, setCanvas] = useState([]);

    const addElement = (el) => {
        if (canvas.length < 8) { // Ограничим 8 элементами для красоты
            setCanvas([...canvas, { ...el, key: Date.now() }]);
        }
    };

    const clearCanvas = () => setCanvas([]);

    return (
        <div className="constructor-container">
            <p>Соберите свой узор, нажимая на элементы:</p>
            <div className="canvas-area">
                <AnimatePresence>
                    {canvas.map((item, idx) => (
                        <motion.span
                            key={item.key}
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0 }}
                            className="canvas-item"
                        >
                            {item.icon}
                        </motion.span>
                    ))}
                </AnimatePresence>
                {canvas.length === 0 && <span className="placeholder">Место для вашего узора</span>}
            </div>

            <div className="elements-picker">
                {elements.map(el => (
                    <button key={el.id} onClick={() => addElement(el)} title={el.name}>
                        {el.icon}
                    </button>
                ))}
            </div>

            <button className="secondary-btn" onClick={clearCanvas}>Очистить</button>
        </div>
    );
}

// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';

export function Journey({ route, onFinish, onCancel }) {
  const [currentStep, setCurrentStep] = useState(0);
  const markers = route.markers || [];
  const activePoint = markers[currentStep];

  const nextStep = () => {
    if (currentStep < markers.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onFinish(route.points);
      onCancel(); // Закрываем после финиша
    }
  };

  return (
  <div className="journey-overlay">
    <div className="journey-container">
      <button className="close-journey-btn" onClick={onCancel}>✕</button>

      <header className="journey-header">
        <span className="route-badge" style={{ backgroundColor: route.color }}>
          {route.name}
        </span>
        <h2 className="journey-main-title">{route.title}</h2>
      </header>

      <div className="journey-progress-container">
        <div className="progress-bar-bg">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${((currentStep + 1) / markers.length) * 100}%`,
              backgroundColor: route.color 
            }}
          />
        </div>
        <span className="progress-text">Шаг {currentStep + 1} из {markers.length}</span>
      </div>

      <main className="journey-content">
        <div className="step-info">
          <h3 className="step-name">📍 {activePoint.name}</h3>
          <p className="step-description">{activePoint.description}</p>
        </div>

        <div className="task-box" style={{ borderLeft: `6px solid ${route.color}`, background: `${route.color}10` }}>
          <span className="task-label" style={{ color: route.color }}>📜 ЗАДАНИЕ:</span>
          <p>{activePoint.task}</p>
        </div>

        <button 
          className="next-btn" 
          style={{ backgroundColor: route.color }}
          onClick={nextStep}
        >
          {currentStep < markers.length - 1 ? "Я на месте! Дальше →" : "Завершить 🎉"}
        </button>
      </main>
    </div>
  </div>
);
}

// export function Journey({ route, onFinish }) {
//   console.log("Данные маршрута в Journey:", route);
  
//   return (
//     <div style={{ padding: '40px', color: '#2c3e50', textAlign: 'center' }}>
//       <h1>Маршрут: {route?.name}</h1>
//       <p>{route?.title}</p>
//       <div style={{ marginTop: '20px' }}>
//         <h3>Точек на пути: {route?.markers?.length || 0}</h3>
//       </div>
//       <button 
//         onClick={onFinish}
//         style={{ marginTop: '50px', padding: '15px 30px', background: route?.color, color: 'white', border: 'none', borderRadius: '12px' }}
//       >
//         Завершить прогулку
//       </button>
//     </div>
//   );
// }

// export function Journey({ route, onFinish, onCancel }) {
//     if (!route || !route.quiz) return null;

//     const [step, setStep] = useState(1);
//     const [selectedOption, setSelectedOption] = useState(null);

//     return (
//         <motion.div
//             className="journey-overlay"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//         >
//             <motion.div
//                 className="journey-card"
//                 style={{ borderTop: `8px solid ${route.color}` }}
//                 initial={{ scale: 0.8, y: 50, opacity: 0 }}
//                 animate={{ scale: 1, y: 0, opacity: 1 }}
//                 transition={{ type: "spring", damping: 25, stiffness: 300 }}
//             >
//                 <button className="close-btn" onClick={onCancel}>×</button>

//                 {/* AnimatePresence позволяет анимировать исчезновение элементов */}
//                 <AnimatePresence mode="wait">
//                     {step === 1 && (
//                         <motion.div
//                             key="step1"
//                             initial={{ x: 20, opacity: 0 }}
//                             animate={{ x: 0, opacity: 1 }}
//                             exit={{ x: -20, opacity: 0 }}
//                             className="step-content"
//                         >
//                             <div className="journey-progress-container">
//                                 <div className="progress-label">Шаг {step} из 3</div>
//                                 <div className="progress-bar-bg">
//                                     <motion.div
//                                         className="progress-bar-fill"
//                                         initial={{ width: 0 }}
//                                         animate={{ width: `${(step / 3) * 100}%` }}
//                                         transition={{ duration: 0.5 }}
//                                     />
//                                 </div>
//                             </div>
//                             <span className="step-badge">Шаг 1: Знакомство</span>
//                             <h2>{route.name}</h2>
//                             <p>{route.description}</p>
//                             <button onClick={() => setStep(2)}>Перейти к испытанию</button>
//                         </motion.div>
//                     )}

//           // Внутри Journey.jsx измени состояние шагов:
//                     // 1: Инфо, 2: Ремесло, 3: Квиз, 4: Успех

//                     {step === 2 && route.crafts && (
//                         <motion.div
//                             key="step_crafts"
//                             initial={{ x: 20, opacity: 0 }}
//                             animate={{ x: 0, opacity: 1 }}
//                             exit={{ x: -20, opacity: 0 }}
//                             className="step-content"
//                         >
//                             <div className="journey-progress-container">
//                                 <div className="progress-label">Шаг {step} из 3</div>
//                                 <div className="progress-bar-bg">
//                                     <motion.div
//                                         className="progress-bar-fill"
//                                         initial={{ width: 0 }}
//                                         animate={{ width: `${(step / 3) * 100}%` }}
//                                         transition={{ duration: 0.5 }}
//                                     />
//                                 </div>
//                             </div>
//                             <span className="step-badge">Шаг 2: Ремесла</span>
//                             <h3>{route.crafts.title}</h3>
//                             <OrnamentConstructor elements={route.crafts.elements} />
//                             <button className="primary-btn" onClick={() => setStep(3)}>К испытанию</button>
//                         </motion.div>
//                     )}

//                     {step === 3 && (
//                         <motion.div
//                             key="step3"
//                             initial={{ x: 20, opacity: 0 }}
//                             animate={{ x: 0, opacity: 1 }}
//                             exit={{ x: -20, opacity: 0 }}
//                             className="step-content"
//                         >
//                             <div className="journey-progress-container">
//                                 <div className="progress-label">Шаг {step} из 3</div>
//                                 <div className="progress-bar-bg">
//                                     <motion.div
//                                         className="progress-bar-fill"
//                                         initial={{ width: 0 }}
//                                         animate={{ width: `${(step / 3) * 100}%` }}
//                                         transition={{ duration: 0.5 }}
//                                     />
//                                 </div>
//                             </div>
//                             <span className="step-badge">Шаг 3: Испытание</span>
//                             <h3>Викторина</h3>
//                             <p>{route.quiz.question}</p>
//                             <div className="options-list">
//                                 {route.quiz.options.map((opt, idx) => (
//                                     <motion.button
//                                         whileHover={{ scale: 1.02 }}
//                                         whileTap={{ scale: 0.98 }}
//                                         key={idx}
//                                         className={`option-btn ${selectedOption === idx ? 'selected' : ''}`}
//                                         onClick={() => setSelectedOption(idx)}
//                                     >
//                                         {opt}
//                                     </motion.button>
//                                 ))}
//                             </div>
//                             <button onClick={() => {
//                                 if (selectedOption === route.quiz.correct) {
//                                     setStep(4);
//                                     onFinish(route.points);
//                                 } else {
//                                     alert("Попробуй еще раз!");
//                                 }
//                             }} disabled={selectedOption === null}>
//                                 Подтвердить ответ
//                             </button>
//                         </motion.div>
//                     )}

//                     {step === 4 && (
//                         <motion.div
//                             key="step4"
//                             initial={{ scale: 0.5, opacity: 0 }}
//                             animate={{ scale: 1, opacity: 1 }}
//                             className="step-content success"
//                         >
//                             <motion.div
//                                 animate={{ rotate: [0, 10, -10, 10, 0] }}
//                                 transition={{ repeat: Infinity, duration: 2 }}
//                                 className="icon"
//                             >
//                                 🎉
//                             </motion.div>
//                             <h3>Путешествие завершено!</h3>
//                             <p className="points-added">+{route.points} XP</p>
//                             <button onClick={onCancel}>Вернуться к карте</button>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>
//             </motion.div>
//         </motion.div>
//     );
// }