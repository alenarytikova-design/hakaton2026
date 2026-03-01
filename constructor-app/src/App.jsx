import React, { useState } from 'react'

function App() {
  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8" data-theme="retro">
      <div className="max-w-5xl mx-auto">
        
        {/* Шапка */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-primary mb-2">🌿 Конструктор сценариев</h1>
          <p className="text-lg opacity-70">Культура и традиции народов России</p>
        </header>

        {/* Форма фильтров */}
        <div className="card bg-base-100 shadow-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text">Тема</span></label>
              <select className="select select-bordered">
                <option>Легенды Кавказа</option>
                <option>Праздники Сибири</option>
              </select>
            </div>
            
            <div className="form-control">
              <label className="label"><span className="label-text">Возраст</span></label>
              <select className="select select-bordered">
                <option>Начальная школа</option>
                <option>Средние классы</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">Длительность</span></label>
              <select className="select select-bordered">
                <option>15 минут</option>
                <option>30 минут</option>
              </select>
            </div>

            <div className="form-control mt-9">
              <button className="btn btn-primary">Подобрать сценарии</button>
            </div>
          </div>
        </div>

        {/* Сетка с результатами */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-base-100 shadow-xl border-t-4 border-secondary">
            <div className="card-body">
              <div className="badge badge-secondary mb-2">30 минут</div>
              <h2 className="card-title">Традиции гостеприимства</h2>
              <p className="text-sm opacity-60 italic">Цель: Познакомить с обычаями приема гостей.</p>
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-sm btn-outline">Открыть сценарий</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default App