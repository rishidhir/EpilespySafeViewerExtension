CURRENT_PAGE = "";
BLOCK = {
    times: [],
    state: 0
}



function webpageNavigate() {
    if ('/watch' === location.pathname) {
        
        var url = new URL(location.href);
        getShieldTimesForVideo(location.href)
            .then((shieldTimes) => {
                resetShieldTimes(shieldTimes)
            })
            .catch((error) => {
                console.error('Error: No blocking times:', error);
            })
    }
}

function getShieldTimesForVideo(){
    return fetch('https://localhost:5000/get_blocked_timestamps?url='+location.href, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success: we have gotten data:', data);
            return data['result']
        })
}



function resetShieldTimes(newShieldTimes){
    BLOCK = {
        times: newShieldTimes,
        state: 0
    }
}

function setFilter(update){
    var cover = document.getElementsByClassName('ESV');
    var videos = document.getElementsBy("video");
    if(cover.length == 0){
        var youtube_video = document.getElementsByTagName("video");
        // if(youtube_video.length ==0){
        //     return
        // }

        shield = document.createElement("div")
        shield.innerHTML = 'Epilepsy Safety Shield Active'
        shield.className = 'ESV'
        shield.style.display = 'none'
        // shield.style.position = "relative";
        // shield.style.width = youtube_video.style.width;
        // shield.style.height = youtube_video.style.height;
        shield.style.backgroundColor = "black";
        shield.style.textAlign = "center";
        shield.style.opacity = "0.9";
        shield.style.color = "lightgray";
        shield.style.fontSize = "50px";
        // shield.style.paddingTop = "200px";
        // youtube_video[0].parentElement.appendChild(cover)
        cover = document.getElementsByClassName('ESV')        

    }

    shield=cover[0]
    youtube_video = videos[0]

    if(update){

        shield.style.display = "block"
        shield.style.width = youtube_video.style.width;
        shield.style.height = youtube_video.style.height;
        shield.style.left = youtube_video.style.left;
        shield.style.top = youtube_video.style.top;
        
    } else {
        shield.style.display = "none"
    }
    

}


function activateShield(){

   streams = document.getElementsByClassName('video-stream')
   
   stream = streams[0];

   current_time = stream.currentTime;

   while (BLOCK['state'] < BLOCK['times'].length && currtime >= BLOCK['times'][BLOCK['state']][0]){
    setShieldFilter(BLOCK['times'][BLOCK['state']][1])
    BLOCK['state'] += 1
    }


}

setInterval(() => {
    if (CURRENT_PAGE != location.href){
        CURRENT_PAGE = location.href;
        afterNavigate();
    }
}, 1000)


setInterval(() => {
    activateShield()
}, 50)


webpageNavigate();