import React, { useState } from 'react'
import data from './scenarios.json';
import logoEagle from './assets/logo-eagle.jpeg';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { regionsData, defaultData } from './regionsData';


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
        id: `${Date.now()}-${i}`,
        title: `Сценарий: ${topic} (Вариант ${i + 1})`,
        intro: topicIntros[randomI].text,
        main: topicMains[randomM].text,
        reflection: topicEnds[randomE].text,
        spoiler: `${topicIntros[randomI].text.split(':')[0]} → Интерактив: ${topicMains[randomM].text.substring(0, 60)}...`,
        goal: `Познакомить ${age === 'Любой' ? 'учащихся всех возрастов' : 'учащихся (' + age + ')'} ` +
          `с культурными особенностями в течение ${duration === 'Любая' ? 'занятия' : duration}.`,

        tools: "Интерактивная доска, смартфоны, цифровые ресурсы",
        age: age,
        duration: duration,
        topic: topic,
        conclusion: "Культура — это живой процесс, объединяющий поколения."
      });
    }

    setFilteredScenarios(generatedList);
  };
  const exportToPDF = () => {
    const input = document.getElementById('pdf-content'); // ID блока, который качаем

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Сценарий_${selectedScenario.topic}.pdf`);
    });
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
                onChange={(e) => { setTopic(e.target.value); if (e.target.value !== 'Выбрать тему') setError(''); }}
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

                      <div className="bg-blue-50/30 p-4 rounded-2xl border border-blue-100/50">
                        <p className="text-[10px] font-black text-primary uppercase mb-2 tracking-widest flex items-center gap-2">
                          <span className="text-sm">⚡️</span> Краткое содержание:
                        </p>
                        <p className="text-gray-600 leading-relaxed text-sm italic">
                          {s.spoiler}
                        </p>
                      </div>

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

            {/* ✅ НОВЫЙ ДИНАМИЧНЫЙ БЛОК: Карточка региона */}
            <div className="hidden xl:block">
              <div className="bg-white rounded-3xl border border-gray-100 sticky top-10 shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300">

                {/* Изображение с градиентным наложением */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={topic !== 'Выбрать тему' && regionsData[topic] ? regionsData[topic].image : defaultData.image}
                    alt={topic !== 'Выбрать тему' ? topic : 'Наследие России'}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                  {/* Текст поверх картинки */}
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <p className="text-[10px] font-black opacity-70 uppercase tracking-widest mb-1">Региональный фокус</p>
                    <h4 className="text-xl font-bold leading-tight">
                      {topic !== 'Выбрать тему' ? topic : 'Культура России'}
                    </h4>
                  </div>
                </div>

                {/* Контентная часть */}
                <div className="p-6 space-y-5">
                  <div className="flex gap-3 items-start">
                    <span className="text-xl mt-1">🏛️</span>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {topic !== 'Выбрать тему' && regionsData[topic]
                        ? regionsData[topic].description
                        : defaultData.description}
                    </p>
                  </div>

                  <div className="h-[1px] bg-gray-100 w-full"></div>

                  {/* Интересный факт */}
                  <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <p className="text-[9px] font-black text-gray-400 uppercase mb-2 tracking-widest">Знаете ли вы?</p>
                    <p className="text-[11px] text-gray-500 italic leading-snug">
                      {topic !== 'Выбрать тему' && regionsData[topic]
                        ? regionsData[topic].fact
                        : defaultData.fact}
                    </p>
                  </div>

                  <p className="text-[10px] text-gray-400 font-bold uppercase text-center mt-2">
                    {topic !== 'Выбрать тему' ? 'Генерация готова' : 'Ожидание выбора'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {selectedScenario && (
        <div className="modal modal-open backdrop-blur-sm">
          {/* Добавляем фиксированную высоту для всей модалки, чтобы она не вылезала за экран */}
          <div className="modal-box max-w-3xl max-h-[90vh] rounded-[2.5rem] border-[6px] border-[#1E3A8A] p-0 flex flex-col overflow-hidden shadow-2xl bg-white">

            {/* 1. ОБЛАСТЬ ПРОКРУТКИ (Контент для PDF) */}
            <div className="flex-grow overflow-y-auto p-2">
              <div id="pdf-content" style={{ backgroundColor: '#ffffff' }} className="p-8">
                {/* Твой контент (Header, блоки с текстом и т.д.) остается здесь */}
                <div className="flex justify-between items-start mb-8 border-b-2 border-[#1E3A8A] pb-6">
                  <div className="max-w-[70%]">
                    <h3 className="font-black text-3xl text-[#1E3A8A] uppercase">
                      {selectedScenario.title}
                    </h3>
                  </div>
                  <img src={logoEagle} alt="Лого" className="w-16 h-16 object-contain" />
                </div>

                {/* Инфо-панель */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-[#f0f4f8] p-4 rounded-2xl">
                    <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Аудитория и время</p>
                    <p className="text-sm font-bold text-[#1E3A8A]">
                      {selectedScenario.age === 'Любой' ? 'Все классы' : selectedScenario.age}
                      <span className="mx-2 text-gray-300">|</span>
                      {selectedScenario.duration === 'Любая' ? 'Гибкий тайминг' : selectedScenario.duration}
                    </p>
                  </div>
                  <div className="bg-[#f0f4f8] p-4 rounded-2xl text-right">
                    <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Тематическое направление</p>
                    <p className="text-sm font-bold text-[#1E3A8A]">{selectedScenario.topic}</p>
                  </div>
                </div>

                {/* Содержание этапов */}
                <div className="space-y-6 text-sm">
                  <div className="relative pl-6 border-l-2 border-[#A65E4E]">
                    <p className="font-black text-[#1E3A8A] uppercase text-[11px] mb-1">Цель занятия</p>
                    <p className="text-gray-700 leading-relaxed">{selectedScenario.goal}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="bg-gray-50 p-5 rounded-2xl">
                      <p className="font-black text-[#1E3A8A] uppercase text-[11px] mb-2">Этап 1: Мотивация (Вступление)</p>
                      <p className="text-gray-600 italic">"{selectedScenario.intro}"</p>
                    </div>

                    <div className="bg-gray-50 p-5 rounded-2xl">
                      <p className="font-black text-[#1E3A8A] uppercase text-[11px] mb-2">Этап 2: Основная деятельность</p>
                      <p className="text-gray-600">{selectedScenario.main}</p>
                    </div>

                    <div className="bg-gray-50 p-5 rounded-2xl">
                      <p className="font-black text-[#1E3A8A] uppercase text-[11px] mb-2">Этап 3: Рефлексия и итоги</p>
                      <p className="text-gray-600">{selectedScenario.reflection}</p>
                    </div>
                  </div>

                  {/* Футер внутри PDF */}
                  <div className="pt-8 text-center">
                    <div className="h-[1px] bg-gray-100 w-full mb-4"></div>
                    <p className="text-[9px] font-medium text-gray-400 uppercase tracking-widest">
                      Сгенерировано платформой «Наследие России» • 2026
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* КНОПКИ (НЕ ПОПАДАЮТ В PDF) */}
            <div className="modal-action bg-[#f8f9fb] p-6 m-0 flex gap-4 border-t">
              <button
                className="btn bg-[#A65E4E] hover:bg-[#8d4e41] border-none text-white flex-grow rounded-2xl font-black uppercase tracking-widest shadow-lg transition-all active:scale-95"
                onClick={exportToPDF}
              >
                📥 Сохранить сценарий (PDF)
              </button>
              <button
                className="btn btn-ghost rounded-2xl uppercase font-bold text-gray-400"
                onClick={() => setSelectedScenario(null)}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App;