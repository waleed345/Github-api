function getData(){
    // user = document.getElementById('user').value;
    // if(user == ""){
    //     alert('Please Enter UserName');
    //     return
    // }
    fetch('https://api.github.com/users').then(function(response){
        return response.json();
    }).then(data => {
        console.log('data from fetch api',data);
        document.getElementById('output').innerHTML = JSON.stringify(data)
    }).catch(err => {
        console.log('Error in API', err);
    }) 
}

caches.match('https://api.github.com/users').then(function(response){
    if(!response){
        console.log("No Data")
    }
    return response.json();
}).then(function(data){
    console.log(data)
    // document.getElementById('output').innerHTML = JSON.stringify(data);
}).catch(err => {
    console.log('cache error',err);
})
