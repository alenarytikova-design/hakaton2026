import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { ethnoRoutes } from './data/routes'
import './App.css'
import { EthnoMap } from './components/EthnoMap';
import { Journey } from './components/Journey';

const AVATARS = [
  { id: 'matryoshka', label: 'Матрешка', icon: '🪆' },
  { id: 'sun', label: 'Ярило', icon: '☀️' },
  { id: 'bear', label: 'Хозяин леса', icon: '🐻' },
  { id: 'pattern', label: 'Узор', icon: '🌀' }
];

// Компонент Profile оставляем снаружи, он написан верно
function Profile({ user, setUser, setScreen }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(user.name);
  const [tempAvatar, setTempAvatar] = useState(user.avatar || '👤');

  const saveProfile = () => {
    setUser({ ...user, name: tempName, avatar: tempAvatar });
    setIsEditing(false);
  };

  const resetProgress = () => {
    if (confirm("Вы уверены, что хотите сбросить весь прогресс?")) {
      localStorage.removeItem('ethno_user');
      window.location.reload(); // Перезагружаем страницу для чистого состояния
    }
  };

  return (
    <section className="profile-card">
      <div className="profile-header">
        <span className="profile-avatar-large">{user.avatar || '👤'}</span>
        <h2>Личный кабинет</h2>
      </div>

      {isEditing ? (
        <div className="edit-form">
          <label>Ваше имя:</label>
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
          />
          <label>Выберите оберег:</label>
          <div className="avatar-picker">
            {AVATARS.map(av => (
              <button
                key={av.id}
                className={tempAvatar === av.icon ? 'active' : ''}
                onClick={() => setTempAvatar(av.icon)}
              >
                {av.icon}
              </button>
            ))}
          </div>
          <div className="button-group">
            <button className="save-btn" onClick={saveProfile}>Сохранить</button>
            <button className="cancel-btn" onClick={() => setIsEditing(false)}>Отмена</button>
          </div>
        </div>
      ) : (
        <div className="profile-info">
          <p><strong>Путешественник:</strong> {user.name}</p>
          <p><strong>Баллы:</strong> {user.points} XP</p>
          <div className="button-group">
            <button onClick={() => setIsEditing(true)}>Редактировать профиль</button>
            <button className="secondary" onClick={() => setScreen('catalog')}>К маршрутам</button>
          </div>
        </div>
      )}
    </section>
  );
}

function App() {
  const [screen, setScreen] = useState('welcome');
  const [currentRoute, setCurrentRoute] = useState(null);

  // Инициализируем состояние функцией, которая проверяет localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('ethno_user');
    return savedUser ? JSON.parse(savedUser) : {
      name: 'Путешественник',
      avatar: '👤',
      completedRoutes: [],
      points: 0
    };
  });

  useEffect(() => {
    localStorage.setItem('ethno_user', JSON.stringify(user));
  }, [user]);

  const finishJourney = (earnedPoints) => {
    if (user.completedRoutes.includes(currentRoute.id)) {
      alert("Вы уже получили знания этого народа, но повторение полезно!");
      return;
    }

    setUser(prev => ({
      ...prev,
      points: prev.points + earnedPoints,
      completedRoutes: [...prev.completedRoutes, currentRoute.id]
    }));
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        {/* Декоративные оранжевые узоры по бокам */}
        <div className="side-decor left-decor"></div>
        <div className="side-decor right-decor"></div>
        <div className="nav-container">
          <div className="logo-group" onClick={() => setScreen('welcome')}>
            <div className="logo-symbol">Э</div>
            <span className="logo-text">Этно<span>Самара</span></span>
          </div>

          <div className="nav-right">
            <div className="user-stats-card" onClick={() => setScreen('profile')}>
              <div className="user-icon-bg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="user-info-text">
                <span className="u-name">Путешественник</span>
                <span className="u-xp">{user.points} XP</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="content">
        {screen === 'welcome' && (
          <section className="hero">
            <div className="hero-overlay"></div> {/* Слой для затемнения фона */}
            <motion.div
              className="hero-content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="hero-subtitle">Интерактивный путеводитель</span>
              <h1>Наследие народов <br /><span>Самары</span></h1>
              <p>Откройте для себя богатство культур, традиций и истории родного края в игровом формате</p>
              {/* Визуальный акцент: стилизованный горизонт Самары или паттерн */}
              <motion.div
                className="hero-visual"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                <div className="hero-main-illustration">
                  {/* Здесь можно оставить просто декоративный ромб или вставить иконку */}
                  <div className="decor-diamond"></div>
                </div>

                <button className="main-start-btn" onClick={() => setScreen('catalog')}>
                  Начать путь
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </motion.div>

              {/* Футер для главного экрана */}
              <footer className="hero-footer">
                <div className="footer-line"></div>
                <p>© 2026 ЭтноСамара — Интерактивное сохранение культурного кода</p>
              </footer>
            </motion.div>

            {/* Декоративный элемент - летящий орнамент */}
            <div className="hero-pattern-decor"></div>
          </section>
        )}

        {/* Экран путешествия показываем поверх всего, если выбран маршрут */}
        {currentRoute && (
          <Journey
            key={currentRoute.id}
            route={currentRoute}
            onFinish={finishJourney}
            onCancel={() => {
              console.log("Закрываем маршрут");
              setCurrentRoute(null);
            }}
          />
        )}

        {screen === 'catalog' && (
          <div className="catalog-wrapper">
            <section className="map-section">
              <EthnoMap onSelectRoute={(route) => setCurrentRoute(route)} />
            </section>

            <section className="routes-bottom-section">
              <h2 className="section-title">Все Маршруты</h2>
              <div className="route-grid">
                {ethnoRoutes.map((route) => (
                  <motion.div
                    key={route.id}
                    className="route-card"
                    style={{ '--route-color': route.color }}
                    whileHover={{ y: -8 }}
                  >
                    <div className="card-content">
                      <div className="card-icon-circle" style={{ backgroundColor: route.color + '22' }}>
                        {/* 1. Если в данных есть ссылка на файл .svg в assets */}
                        {route.icon && route.icon.includes('.svg') ? (
                          <img
                            src={route.icon}
                            alt=""
                            style={{ width: '35px', height: '35px', objectFit: 'contain' }}
                          />
                        ) : (
                          /* 2. Если файла нет, рисуем через svgPath (как было раньше) */
                          <svg width="30" height="30" viewBox="0 0 100 100" fill={route.color}>
                            <path d={route.svgPath} />
                          </svg>
                        )}
                      </div>
                      <div className="card-text">
                        <h3>{route.name}</h3>
                        <p>{route.title}</p>
                      </div>
                    </div>
                    <button
                      className="card-explore-btn"
                      style={{ backgroundColor: route.color }}
                      onClick={() => setCurrentRoute(route)}
                    >
                      Изучить <span className="btn-xp">+{route.points} XP</span>
                    </button>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>
        )}
        {screen === 'profile' && (
          <Profile
            user={user}
            setUser={setUser}
            setScreen={setScreen}
          />
        )}

        <AnimatePresence>
          {currentRoute && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}  // Начальное состояние (снизу и прозрачно)
              animate={{ opacity: 1, y: 0 }}   // Появляется
              exit={{ opacity: 0, y: 50 }}    // Исчезает (вниз и прозрачно)
              className="journey-overlay"      // Обязательно добавь класс с z-index в CSS
            >
              <Journey
                route={currentRoute}
                onFinish={() => setCurrentRoute(null)}
              />

              {/* Кнопка закрытия, чтобы выйти из маршрута */}
              <button
                className="close-journey-btn"
                onClick={() => setCurrentRoute(null)}
              >
                Закрыть
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;