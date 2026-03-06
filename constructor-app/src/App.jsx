import React, { useState } from 'react'
import data from './scenarios.json';

function App() {
  // 1. СОСТОЯНИЯ
  const [topic, setTopic] = useState('Выбрать тему');
  const [age, setAge] = useState('Любой');
  const [duration, setDuration] = useState('Любая');
  const [filteredScenarios, setFilteredScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null); // Для модалки
  const [error, setError] = useState('');

 const handleFilter = () => {
    // ПРОВЕРКА: Если тема не выбрана — показываем ошибку и прерываем функцию
    if (topic === 'Выбрать тему') {
      setError('Пожалуйста, выберите тему занятия!');
      setFilteredScenarios([]); // Очищаем результаты, если они были
      return; 
    }

    // Если проверка прошла, сбрасываем ошибку и фильтруем
    setError('');
    
    const results = data.filter(s => {
      const matchTopic = s.topic === topic;
      const matchAge = age === "Любой" || s.age === age;
      const matchDuration = duration === "Любая" || s.duration === duration;
      return matchTopic && matchAge && matchDuration;
    }).slice(0, 5);

    setFilteredScenarios(results);
  };

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8" data-theme="retro">
      <div className="max-w-5xl mx-auto">
        
        {/* Шапка */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-primary mb-2">🌿 Конструктор сценариев</h1>
          <p className="text-lg opacity-70 italic font-serif">Культура и традиции народов России</p>
        </header>

       {/* Блок фильтров */}
        <div className="card bg-base-100 shadow-xl p-6 mb-8 border-t-4 border-primary">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            
            {/* СЕЛЕКТ ТЕМЫ */}
            <div className="form-control text-left">
              <label className="label">
                <span className={`label-text font-bold ${topic === 'Выбрать тему' ? 'text-error' : ''}`}>Тема *</span>
              </label>
              <select 
                className={`select select-bordered ${error ? 'select-error' : ''}`} 
                value={topic} 
                onChange={(e) => {
                  setTopic(e.target.value);
                  if(e.target.value !== 'Выбрать тему') setError(''); // Убираем ошибку при выборе
                }}
              >
                <option disabled value="Выбрать тему">Выбрать тему</option>
                <option>Легенды народов Кавказа</option>
                <option>Праздники Сибири</option>
                <option>Национальные костюмы Поволжья</option>
              </select>
            </div>
            
            <div className="form-control text-left">
              <label className="label"><span className="label-text font-bold uppercase text-xs">Возраст</span></label>
              <select className="select select-bordered" value={age} onChange={(e) => setAge(e.target.value)}>
                <option>Любой</option>
                <option>Начальная школа</option>
                <option>Средние классы</option>
                <option>Старшеклассники</option>
              </select>
            </div>

            <div className="form-control text-left">
              <label className="label"><span className="label-text font-bold uppercase text-xs">Длительность</span></label>
              <select className="select select-bordered" value={duration} onChange={(e) => setDuration(e.target.value)}>
                <option>Любой</option>
                <option>15 минут</option>
                <option>30 минут</option>
                <option>целый урок</option>
              </select>
            </div>

            <button className="btn btn-primary shadow-md" onClick={handleFilter}>Подобрать</button>
          </div>
          {error && (
            <div className="mt-4 text-error text-sm font-bold flex items-center justify-center gap-2 animate-bounce">
              <span>⚠️ {error}</span>
            </div>
          )}
        </div>

        {/* Результаты поиска */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredScenarios.length > 0 ? (
            filteredScenarios.map((s) => (
              <div key={s.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all border-l-4 border-secondary text-left">
                <div className="card-body">
                  <div className="badge badge-secondary badge-outline font-bold mb-2">{s.duration}</div>
                  <h2 className="card-title text-primary text-2xl">{s.title}</h2>
                  <p className="text-sm opacity-70"><strong>Цель:</strong> {s.goal.substring(0, 100)}...</p>
                  <div className="card-actions justify-end mt-4">
                    <button className="btn btn-sm btn-primary" onClick={() => setSelectedScenario(s)}>Открыть сценарий</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center opacity-40 border-2 border-dashed border-base-300 rounded-3xl">
              <p className="text-xl">Настройте фильтры и нажмите "Подобрать"</p>
            </div>
          )}
        </div>

        {/* МОДАЛЬНОЕ ОКНО (7 разделов по ТЗ) */}
        {selectedScenario && (
          <div className="modal modal-open">
            <div className="modal-box max-w-2xl border-2 border-primary">
              <h3 className="font-bold text-2xl text-primary border-b-2 border-primary/20 pb-2 mb-4">
                {selectedScenario.title}
              </h3>
              
              <div className="space-y-4 text-left text-sm">
                <p><strong>👥 Для кого:</strong> {selectedScenario.age}</p>
                <p><strong>🎯 Цель занятия:</strong> {selectedScenario.goal}</p>
                <p><strong>🛠 Цифровые инструменты:</strong> <span className="text-secondary font-bold">{selectedScenario.tools}</span></p>
                
                <div className="divider text-xs text-base-content/40 uppercase tracking-widest">Этапы сценария</div>
                
                <div className="bg-base-200 p-3 rounded-lg">
                  <p className="font-bold text-primary mb-1">1. Вступление</p>
                  <p>{selectedScenario.intro}</p>
                </div>

                <div className="bg-base-200 p-3 rounded-lg">
                  <p className="font-bold text-primary mb-1">2. Основная часть</p>
                  <p>{selectedScenario.main}</p>
                </div>

                <div className="bg-base-200 p-3 rounded-lg">
                  <p className="font-bold text-primary mb-1">3. Рефлексия</p>
                  <p>{selectedScenario.reflection}</p>
                </div>

                <div className="bg-primary/10 p-3 rounded-lg border-l-4 border-primary">
                  <p className="font-bold text-primary mb-1">4. Главный вывод</p>
                  <p>{selectedScenario.conclusion}</p>
                </div>
              </div>

              <div className="modal-action">
                <button className="btn btn-outline" onClick={() => setSelectedScenario(null)}>Закрыть</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default App