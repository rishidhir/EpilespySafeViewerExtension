CURRENT_PAGE = "";
BLOCK = {
    times: [],
    state: 0
}


function afterNavigate() {
    if ('/watch' === location.pathname) {
        
        var url = new URL(location.href);
        getBlockingTimesForVideo(location.href)
            .then((blockingTimes) => {
                resetBlockingTimes(blockingTimes)
            })
            .catch((error) => {
                console.error('Error:', error);
            })
    }
}


function getBlockingTimesForVideo(){
    return fetch('http://127.0.0.1:5000/get_potential_seizure_timestamps?url='+location.href, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            return data['result']
        })
}


function resetBlockingTimes(newBlockingTimes){
    BLOCK = {
        times: newBlockingTimes,
        state: 0
    }
}


function setBlockingFilter(update){
    var masks = document.getElementsByClassName('seizure-control')
    var videos = document.getElementsByTagName("video");
    if (masks.length == 0){
        var videos = document.getElementsByTagName("video");
        if (videos.length == 0){
            return
        }
        mask = document.createElement('div')
        mask.innerHTML = "Seizure-Savior Activated!"
        mask.className = 'seizure-control';
        mask.style.display = "none"
        mask.style.position = "relative";
        mask.style.width = "853px";
        mask.style.height = "480px";
        mask.style.backgroundColor = "black";
        mask.style.left = "409px";
        mask.style.top = "0px";
        mask.style.textAlign = "center";
        mask.style.opacity = "0.9";
        mask.style.color = "lightgray";
        mask.style.fontSize = "50px";
        mask.style.paddingTop = "200px";
        videos[0].parentElement.appendChild(mask)
        masks = document.getElementsByClassName('seizure-control')
    }

    mask = masks[0]
    video = videos[0]
    if (update){
        mask.style.display = "block"
        mask.style.width = video.style.width;
        mask.style.height = video.style.height;
        mask.style.left = video.style.left;
        mask.style.top = video.style.top;
        
    } else {
        mask.style.display = "none"
    }
    
    

    // var videos = document.getElementsByTagName("video");
    // if (videos.length == 0){
    //     return
    // }


    // if (update){
    //     videos[0].style.filter = "brightness(50%) blur(25px) grayscale(100%)";
    // } else {
    //     videos[0].style.filter = "brightness(100%) blur(0px) grayscale(0%)";
    // }
}
// https://www.youtube.com/watch?v=uxKPVD5KJCY


function checkFilter(){
    video_streams = document.getElementsByClassName('video-stream')
    if (video_streams.length == 0){
        return
    }
    video_stream = video_streams[0]
    currtime = video_stream.currentTime;
    while (BLOCK['state'] < BLOCK['times'].length && currtime >= BLOCK['times'][BLOCK['state']][0]){
        setBlockingFilter(BLOCK['times'][BLOCK['state']][1])
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
    checkFilter()
}, 50)

afterNavigate();