var cache = 'cache-v2';
var dcache = 'dcache-v1';
var cacheFiles = [
    'index.html',
    'main.js',
    'style.css',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css',
    'https://code.jquery.com/jquery-3.3.1.slim.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.0/umd/popper.min.js',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/js/bootstrap.min.js',
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
    if(e.request.url.startsWith('https://api.github.com/users')){
        caches.open(dcache).then(function(cache){
            return fetch(e.request).then(function(response){
                cache.put(e.request, response.clone())
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