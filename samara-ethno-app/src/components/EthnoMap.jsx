import { useEffect, useRef } from 'react';
import 'ol/ol.css';
// import { Map, View, Feature } from 'ol';
// import TileLayer from 'ol/layer/Tile';
// import OSM from 'ol/source/OSM';
// import VectorLayer from 'ol/layer/Vector';
// import VectorSource from 'ol/source/Vector';
// import Point from 'ol/geom/Point';
// import { fromLonLat } from 'ol/proj';
// import { Style, Icon } from 'ol/style';
// import { ethnoRoutes } from '../data/routes';
import { Map, View, Feature } from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { LineString, Point } from 'ol/geom';
import { Style, Stroke, Circle, Fill } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import { ethnoRoutes } from '../data/routes'; // Импортируем твои новые данные

export function EthnoMap({ onSelectRoute }) {
    // const mapElement = useRef(); // Привязка к DOM-элементу
    // const mapRef = useRef();     // Ссылка на сам объект карты
    const mapRef = useRef();
    const mapInstance = useRef();

    useEffect(() => {
        // // Инициализируем источник для маркеров
        // const vectorSource = new VectorSource();

        // // Создаем маркеры на основе наших данных
        // ethnoRoutes.forEach((route) => {
        //   const marker = new Feature({
        //     geometry: new Point(fromLonLat([route.position[1], route.position[0]])), // [lon, lat]
        //     routeData: route, // Сохраняем данные маршрута внутри фичи
        //   });

        //   // Стилизация маркера
        //   marker.setStyle(
        //     new Style({
        //       image: new Icon({
        //         anchor: [0.5, 1],
        //         // Можно использовать разные иконки в зависимости от этноса
        //         src: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', 
        //         scale: 0.07,
        //         color: route.color
        //       }),
        //     })
        //   );

        //   vectorSource.addFeature(marker);
        // });

        // const vectorLayer = new VectorLayer({
        //   source: vectorSource,
        // });

        // // Создание карты
        // const initialMap = new Map({
        //   target: mapElement.current,
        //   layers: [
        //     new TileLayer({
        //       source: new OSM(),
        //     }),
        //     vectorLayer,
        //   ],
        //   view: new View({
        //     center: fromLonLat([50.2, 53.5]), // Центр Самарской области
        //     zoom: 7,
        //   }),
        // });

        // // Обработка клика по маркеру
        // initialMap.on('click', (event) => {
        //   initialMap.forEachFeatureAtPixel(event.pixel, (feature) => {
        //     const route = feature.get('routeData');
        //     if (route) {
        //       onSelectRoute(route);
        //     }
        //   });
        // });

        // mapRef.current = initialMap;

        // // Очистка при размонтировании
        // return () => initialMap.setTarget(null);
        //---------------------------
        // Создаем источник для всех путей и маркеров
        const vectorSource = new VectorSource();

        ethnoRoutes.forEach(route => {
            // 1. Создаем линию маршрута (Path)
            // ВАЖНО: координаты в данных [lat, lon], а OL ждет [lon, lat]
            const coordinates = route.path.map(coord => fromLonLat([coord[1], coord[0]]));

            const lineFeature = new Feature({
                geometry: new LineString(coordinates)
            });

            // Стилизуем линию цветом из данных маршрута
            lineFeature.setStyle(new Style({
                stroke: new Stroke({
                    color: route.color,
                    width: 4
                })
            }));

            vectorSource.addFeature(lineFeature);

            // 2. Создаем маркеры (Markers) для каждой остановки
            route.markers.forEach(m => {
                const markerFeature = new Feature({
                    geometry: new Point(fromLonLat([m.position[1], m.position[0]])),
                    name: m.name,
                    description: m.description
                });

                markerFeature.setStyle(new Style({
                    image: new Circle({
                        radius: 7,
                        fill: new Fill({ color: route.color }),
                        stroke: new Stroke({ color: 'white', width: 2 })
                    })
                }));

                vectorSource.addFeature(markerFeature);
            });
        });

        // Добавляем векторный слой в карту
        const vectorLayer = new VectorLayer({
            source: vectorSource
        });

        // При инициализации карты:
        const map = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({ source: new OSM() }),
                vectorLayer // Наш новый слой с маршрутами
            ],
            view: new View({
                center: fromLonLat([50.15, 53.20]), // Центр Самары
                zoom: 12
            })
        });

        // map.on('click', (event) => {
        //     map.forEachFeatureAtPixel(event.pixel, (feature) => {
        //         const routeData = feature.get('routeData');
        //         if (routeData) {
        //             onSelectRoute(routeData); // Открываем маршрут при клике на точку
        //         }
        //     });
        // });
        map.on('click', (event) => {
            // Ищем объект под курсором
            const feature = map.forEachFeatureAtPixel(event.pixel, (f) => f, {
                hitTolerance: 5 // Допуск в пикселях, чтобы было легче попасть по линии
            });

            if (feature) {
                // Получаем данные маршрута, которые мы привязали к фиче
                const routeData = feature.get('routeData');

                if (routeData) {
                    console.log("Клик по маршруту на карте:", routeData.name);
                    onSelectRoute(routeData);
                }
            }
        });

        mapInstance.current = map;
        return () => map.setTarget(null);
    }, [onSelectRoute]);

    // return (
    //     // <div className="map-wrapper">
    //     //     <div ref={mapElement} className="map-container" style={{ height: '450px', width: '100%' }}></div>
    //     // </div>
    // );
    return <div ref={mapRef} className="map-container" />;
}
