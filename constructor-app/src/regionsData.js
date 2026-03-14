// src/regionsData.js
import kavkazImg from './assets/kavkaz.jpg';
import siberiaImg from './assets/siberia.jpg';
import povolzhyeImg from './assets/povolzhye.jpg';
import defaultImg from './assets/default-russia.jpg';

export const regionsData = {
  "Легенды народов Кавказа": {
    image: kavkazImg,
    description: "Погружение в культуру гор: кодекс чести, гостеприимство и древние сказания Нартского эпоса.",
    fact: "Гора Эльбрус — самая высокая точка России и Европы (5642 м)."
  },
  "Праздники Сибири": {
    image: siberiaImg,
    description: "Традиции народов Севера: шаманизм, праздник встречи солнца (Ысыах) и гармония с суровой природой.",
    fact: "Озеро Байкал содержит около 20% мировой пресной озерной воды."
  },
  "Национальные костюмы Поволжья": {
    image: povolzhyeImg,
    description: "Многоцветие культур: символика орнаментов, виды вышивки и история костюмов татар, чувашей, марийцев.",
    fact: "Река Волга — самая длинная и многоводная река в Европе."
  }
};

export const defaultData = {
  image: defaultImg,
  description: "Выберите тему занятия слева, чтобы открыть методическую карту региона.",
  fact: "Россия — самое большое государство в мире по площади."
};