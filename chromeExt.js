CURRENT_PAGE = "";
BLOCK = {
    times: [],
    state: 0
}

var seizureMessage = "ESV Screen Applied"
var coverColour = "black"
var coverOpacity = "0.9"
var textColour = "white"
var coverFontsize = "50px"


function Navigate(){

    if ('/watch' === location.pathname){
        var url = new URL(location.href);
        fetchCoverTime(location.href)
            .then((coverTime) => {
                console.log(coverTime)
                BLOCK.times = coverTime
        })
    }
}

function fetchCoverTime(){
    return fetch('http://127.0.0.1:5000/get_potential_seizure_timestamps?url='+location.href, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Recieved Data:', data);
            return data['result']
        })
}


function coverFilter(coverTime){

    var covers = document.getElementsByClassName('ESV')
    var youTubeVideos = document.getElementsByTagName("video");
    youTubeVideo = youTubeVideos[0]

    if(covers.length == 0){
        var youTubeVideos = document.getElementsByTagName("video");
        if(youTubeVideos.length == 0){
            return
        }
        cover = document.createElement('div');
        cover.innerHTML = seizureMessage;
        cover.className = 'ESV';
        cover.style.display = "none";
        cover.style.position = "relative";
        cover.style.width = youTubeVideo.style.width;
        cover.style.height = youTubeVideo.style.height;
        cover.style.backgroundColor = coverColour;
        cover.style.textAlign = "center";
        cover.style.opacity = coverOpacity;
        cover.style.color = textColour;
        cover.style.fontSize = coverFontsize;
        cover.style.left = youTubeVideo.style.left;
        cover.style.top = youTubeVideo.style.top;
        cover.style.paddingTop = "200px";
        
        youTubeVideos[0].parentElement.appendChild(cover)
        covers = document.getElementsByClassName('ESV')
    }
    cover = covers[0]
    if (coverTime){
        cover.style.display = "block"
    }
    else{
        cover.style.display = "none"
    }
}

function activateCover(){
    video_streams = document.getElementsByClassName('video-stream')
    if (video_streams.length == 0){
        return
    }
    video_stream = video_streams[0]
    currtime = video_stream.currentTime;
    while (BLOCK['state'] < BLOCK['times'].length && currtime >= BLOCK['times'][BLOCK['state']][0]){
        coverFilter(BLOCK['times'][BLOCK['state']][1])
        BLOCK['state'] += 1
    }
}

setInterval(() => {
    if (CURRENT_PAGE != location.href){
        CURRENT_PAGE = location.href;
        Navigate();
    }
}, 1000)

setInterval(() => {
    activateCover()
}, 50)

Navigate();