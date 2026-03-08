import React, { useState } from 'react'
import data from './scenarios.json';
import logoEagle from './assets/logo-eagle.jpeg';


function App() {
  // --- СОСТОЯНИЯ ---
  const [topic, setTopic] = useState('Выбрать тему');
  const [age, setAge] = useState('Любой');
  const [duration, setDuration] = useState('Любая');
  const [filteredScenarios, setFilteredScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [error, setError] = useState('');

  // --- ЛОГИКА ФИЛЬТРАЦИИ ---
  const handleFilter = () => {
  // 1. Проверка на выбор темы
  if (topic === 'Выбрать тему') {
    setError('Пожалуйста, выберите тему занятия!');
    setFilteredScenarios([]);
    return; 
  }

  setError('');
  
  // 2. Выделяем блоки только по выбранной теме
  const topicIntros = data.intros.filter(i => i.topic === topic);
  const topicMains = data.mainBlocks.filter(m => m.topic === topic);
  const topicEnds = data.conclusions.filter(e => e.topic === topic);

  // Если вдруг данных по теме нет (защита от ошибок)
  if (topicIntros.length === 0 || topicMains.length === 0 || topicEnds.length === 0) {
    setError('Недостаточно данных для генерации сценария по этой теме.');
    return;
  }

  const generatedList = [];

  // 3. Генерируем 5 вариантов
  for (let i = 0; i < 5; i++) {
    // Выбираем случайные индексы
    const randomI = Math.floor(Math.random() * topicIntros.length);
    const randomM = Math.floor(Math.random() * topicMains.length);
    const randomE = Math.floor(Math.random() * topicEnds.length);

    generatedList.push({
      id: `${Date.now()}-${i}`, // Уникальный ключ
      title: `Сценарий: ${topic} (Вариант ${i + 1})`,
      intro: topicIntros[randomI].text,
      main: topicMains[randomM].text,
      reflection: topicEnds[randomE].text,
      goal: `Познакомить учащихся (${age}) с культурными особенностями через ${duration} активной работы.`,
      tools: "Интерактивная доска, смартфоны, Google Services",
      age: age,
      duration: duration,
      conclusion: "Культура — это живой процесс, объединяющий поколения."
    });
  }

  setFilteredScenarios(generatedList);
};

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {/* 1. ШАПКА (Header) */}
      <header className="navbar bg-white border-b px-6 md:px-12 h-20 shrink-0">
        <div className="flex-1 gap-3">
          <img src={logoEagle} alt="Лого" className="w-10 h-10 object-contain rounded-full" />
          <span className="text-xl font-extrabold tracking-tight text-gray-800">Наследие России</span>
        </div>
        <div className="flex-none gap-8 hidden md:flex">
          <nav className="flex gap-6 text-sm font-bold uppercase tracking-wider">
            <span className="text-primary border-b-2 border-primary pb-1 cursor-default">Конструктор сценариев</span>
            <span className="text-gray-400 hover:text-primary cursor-pointer transition-colors">Библиотека</span>
          </nav>
          <button onClick={handleFilter} className="btn btn-sm btn-terracotta px-6">Подобрать шаблоны</button>
        </div>
      </header>

      {/* 2. ГЛАВНЫЙ КОНТЕНТ */}
      <main className="flex-grow max-w-[1440px] mx-auto w-full p-6 md:p-10 grid grid-cols-1 md:grid-cols-[340px,1fr] gap-10">
        
        {/* ЛЕВАЯ ПАНЕЛЬ (Sidebar) */}
        <aside className="sidebar-navy rounded-3xl p-8 shadow-2xl h-fit sticky top-10">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-xl">⚙️</span>
            <h2 className="text-lg font-bold uppercase tracking-tighter">Настройки</h2>
          </div>

          <div className="space-y-6">
            <div className="form-control">
              <label className="label pt-0"><span className="label-text text-blue-100/70 text-xs font-bold uppercase">Тема урока *</span></label>
              <select 
                className={`select select-bordered sidebar-select w-full ${error ? 'border-red-400 error-shake' : ''}`}
                value={topic}
                onChange={(e) => { setTopic(e.target.value); if(e.target.value !== 'Выбрать тему') setError(''); }}
              >
                <option disabled value="Выбрать тему">Выбрать тему</option>
                <option>Легенды народов Кавказа</option>
                <option>Праздники Сибири</option>
                <option>Национальные костюмы Поволжья</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label pt-0"><span className="label-text text-blue-100/70 text-xs font-bold uppercase">Для кого</span></label>
              <select className="select select-bordered sidebar-select w-full" value={age} onChange={(e) => setAge(e.target.value)}>
                <option>Любой</option>
                <option>Начальная школа</option>
                <option>Средние классы</option>
                <option>Старшеклассники</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label pt-0"><span className="label-text text-blue-100/70 text-xs font-bold uppercase">Длительность</span></label>
              <select className="select select-bordered sidebar-select w-full" value={duration} onChange={(e) => setDuration(e.target.value)}>
                <option>Любая</option>
                <option>15 минут</option>
                <option>30 минут</option>
                <option>целый урок</option>
              </select>
            </div>

            <button onClick={handleFilter} className="btn btn-terracotta w-full mt-4 py-6 h-auto text-base">
              Подобрать сценарии
            </button>

            {error && <p className="text-red-300 text-[10px] font-bold text-center mt-2 uppercase tracking-widest">{error}</p>}
          </div>
        </aside>

        {/* ПРАВАЯ ЧАСТЬ (Результаты) */}
        <section className="flex flex-col">
          <div className="flex justify-between items-end mb-8">
            <h3 className="text-3xl font-black text-gray-800 uppercase tracking-tighter">
              Результаты: <span className="text-primary">{filteredScenarios.length}</span>
            </h3>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Март 2026</div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr,280px] gap-8">
            {/* Список карточек */}
            <div className="space-y-6">
              {filteredScenarios.length > 0 ? (
                filteredScenarios.map(s => (
                  <div key={s.id} className="scenario-card overflow-hidden group">
                    <div className="p-8 border-b border-gray-100 flex justify-between items-start bg-white">
                      <div>
                        <div className="flex gap-2 mb-3">
                           <span className="bg-blue-50 text-primary text-[10px] font-black uppercase px-2 py-1 rounded-md">{s.age}</span>
                           <span className="bg-orange-50 text-secondary text-[10px] font-black uppercase px-2 py-1 rounded-md">{s.duration}</span>
                        </div>
                        <h2 className="text-2xl font-extrabold text-gray-900 group-hover:text-primary transition-colors">{s.title}</h2>
                      </div>
                      <span className="text-4xl opacity-5 select-none">🦅</span>
                    </div>

                    <div className="p-8 bg-white space-y-6">
                       <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs">1</div>
                          <div className="steps-divider"></div>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">7 разделов контента</span>
                          <div className="steps-divider"></div>
                          <div className="w-8 h-8 rounded-full border-2 border-gray-200 text-gray-300 flex items-center justify-center font-bold text-xs">7</div>
                       </div>
                       
                       <p className="text-gray-500 leading-relaxed text-sm">
                         <strong className="text-gray-800">Методическая цель:</strong> {s.goal}
                       </p>
                       
                       <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Цифровой урок</span>
                         <button className="btn btn-primary btn-outline btn-sm rounded-xl px-6 font-bold" onClick={() => setSelectedScenario(s)}>
                            Открыть план
                         </button>
                       </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-[2rem] border-2 border-dashed border-gray-200 p-24 text-center">
                   <div className="text-5xl mb-4 opacity-20">📂</div>
                   <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Выберите тему для формирования сценария</p>
                </div>
              )}
            </div>

            {/* Боковая панель (Preview) */}
            <div className="hidden xl:block">
               <div className="bg-white rounded-3xl border border-gray-100 p-6 sticky top-10 shadow-sm">
                  <div className="aspect-[3/4.2] bg-gray-50 rounded-2xl mb-6 border-2 border-dashed border-gray-100 flex flex-col items-center justify-center p-8 text-center">
                      <div className="text-3xl mb-2 opacity-20">📄</div>
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-loose">Предпросмотр печатной версии PDF</p>
                  </div>
                  <button className="btn btn-block btn-ghost btn-xs text-gray-400 font-bold uppercase tracking-tighter hover:bg-transparent">Экспорт в PDF (скоро)</button>
               </div>
            </div>
          </div>
        </section>
      </main>

      {/* 3. МОДАЛКА ДЛЯ ДЕТАЛЬНОГО ПРОСМОТРА (7 разделов) */}
      {selectedScenario && (
        <div className="modal modal-open backdrop-blur-sm">
          <div className="modal-box max-w-3xl rounded-[2.5rem] border-[6px] border-primary p-10 shadow-2xl">
            <h3 className="font-black text-3xl text-primary mb-6 tracking-tighter uppercase">{selectedScenario.title}</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
               <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Инструменты</p>
                  <p className="text-xs font-bold text-primary italic">{selectedScenario.tools}</p>
               </div>
               <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Возраст</p>
                  <p className="text-xs font-bold text-primary uppercase">{selectedScenario.age}</p>
               </div>
            </div>

            <div className="space-y-6 text-sm leading-relaxed text-gray-600">
               <div className="p-1 border-l-4 border-secondary pl-4">
                  <p className="font-black text-gray-900 uppercase text-xs mb-1">1. Цель занятия</p>
                  <p>{selectedScenario.goal}</p>
               </div>
               <div>
                  <p className="font-black text-gray-900 uppercase text-xs mb-1">2. Вступление (Крючок)</p>
                  <p>{selectedScenario.intro}</p>
               </div>
               <div>
                  <p className="font-black text-gray-900 uppercase text-xs mb-1">3. Основная часть</p>
                  <p>{selectedScenario.main}</p>
               </div>
               <div>
                  <p className="font-black text-gray-900 uppercase text-xs mb-1">4. Рефлексия</p>
                  <p>{selectedScenario.reflection}</p>
               </div>
               <div className="bg-blue-50 p-6 rounded-2xl border-2 border-primary/10">
                  <p className="font-black text-primary uppercase text-xs mb-1 italic underline">Главный вывод урока</p>
                  <p className="text-primary font-bold">{selectedScenario.conclusion}</p>
               </div>
            </div>

            <div className="modal-action mt-10">
              <button className="btn btn-primary btn-block rounded-2xl py-4 h-auto font-black uppercase tracking-widest" onClick={() => setSelectedScenario(null)}>Вернуться к списку</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App;