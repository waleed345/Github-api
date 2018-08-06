var user;
function getUser(e){
    if(e == "" & !e){
        console.log('Please Enter GitHub User')
    }else{
        user = e
    }
}

function getData(){
    $('#display').empty();
    fetch('https://api.github.com/users/'+user+'/followers').then(function(response){
        return response.json();
    }).then(data => {
        console.log('data from fetch api',data);
        $('#user_name').text(user +' has '+ data.length +' Followers')
        data.map(function(key,index){
            // console.log(key.avatar_url);
            $('#display').append(
                `<div class="follower">
                    <div class="img">
                        <img src="`+key.avatar_url+`" class="img-fluid" alt="">
                    </div>
                    <div class="detail">
                        <h5 class="text-center">`+key.login+`</h5>
                        <h5 class="text-center"><a class="btn text-black btn-sm btn-success" href="`+key.html_url+`" target="_blank">View</a></h5>
                    </div>
                </div>`
            )            
        })
    }).catch(err => {
        console.log('Error in API', err);
    }) 
}

caches.match('https://api.github.com/users'+user+'/followers').then(function(response){
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
