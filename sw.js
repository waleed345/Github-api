var cache = 'cache-v1';
var dcache = 'dcache-v1';
var cacheFiles = [
    'index.html',
    'main.js',
    'sw.js',
    'style.css',
    '/'
]

if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js').then(register => {
        console.log('ServiceWorker Registered Successfully')
    }).catch(err => {
        console.log(err);
    })
}

self.addEventListener('install',function(e){
    console.log('ServiceWorker Install')
    e.waitUntil(
        caches.open(cache).then(function(cache){
           return cache.addAll(cacheFiles);
        }).catch(err => {
            console.log(err);
        })
    ) 
})

self.addEventListener('activate', function (e) {
    console.log('ServiceWorker Activate')
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cache && key !== dcache) {
                    return caches.delete(key);
                }
            }))
        })
    )
    return self.clients.claim();
})

self.addEventListener('fetch',function(e){
    if(e.request.url == 'https://api.github.com/users'){
        caches.open(dcache).then(function(cache){
            return fetch(e.request).then(function(response){
                cache.put(e.request,response.clone())
                return response
            })
        })
    }else{
        e.respondWith(
            caches.match(e.request).then(function(response){
                return response || fetch(e.request)
            }).catch(err => {
                console.log(err)
            })
        )
    }
   
})