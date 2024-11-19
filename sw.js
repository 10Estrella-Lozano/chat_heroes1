//imports 

importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1'; // Corregido de 'inmitable-v1'

const APP_SHELL = [
    '/',
    'index.html', // Corregido de 'index.thml'
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg', // Corregido de 'img/avatars//wolverine.jpg'
    'js/app.js',
    'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

self.addEventListener('install', e => {
    e.waitUntil(
        Promise.all([
            caches.open(STATIC_CACHE).then(cache => {
                return cache.addAll(APP_SHELL);
            }),
            caches.open(INMUTABLE_CACHE).then(cache => {
                return cache.addAll(APP_SHELL_INMUTABLE);
            })
        ])
    );
}); // Cierre install

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== STATIC_CACHE && key.includes('static')) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
}); // Cierre activate

self.addEventListener('fetch', e=>{

    const respuesta = caches.match(e.request).then(res=>{
        if (res) {
            return res;
        } else {
            return fetch(e.request).then(newRes=>{
                return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes);
            });//cierre then
        }
    });//cierre match

    e.respondWith(respuesta);
});//cierre fetch