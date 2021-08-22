var CURRENT_PAGE = "";
var OVERLAY = {
    times: [],
    state: 0
}

var isLoaderDisplayedYet = false;

var seizureMessage = "Potential Trigger Warning: ESV Shield Applied"
var coverColour = "black"
var coverOpacity = "0.9"
var textColour = "grey"
var coverFontsize = "40px"

function displayLoader() {
    // Pause video
    var iframe = document.querySelector( 'iframe');
	var video = document.querySelector( 'video' );
	if ( iframe ) {
		var iframeSrc = iframe.src;
		iframe.src = iframeSrc;
	}
	if ( video ) {
		video.pause();
	}

    // Showcase loader on video prior to fetching
    let loaderCover = document.createElement('div');
    loaderCover.innerHTML = '<h2>Pre-processing video...</h2><img src="https://i.pinimg.com/originals/7d/b6/23/7db623e4514e37914168ff09f6516cec.gif">'
    loaderCover.className = 'loader-cover';
    loaderCover.style.display = "block";
    loaderCover.style.position = "relative";
    loaderCover.style.width = video.style.width;
    loaderCover.style.height = video.style.height;
    loaderCover.style.backgroundColor = "white";
    loaderCover.style.textAlign = "center";
    loaderCover.style.opacity = coverOpacity;
    loaderCover.style.color = "black";
    loaderCover.style.left = video.style.left;
    loaderCover.style.top = video.style.top;
    loaderCover.style.fontSize = "35px";
    video.parentElement.appendChild(loaderCover)
}

function navigate(){
    if ('/watch' === location.pathname){
        getOverlayTime()
        .then((coverTime) => {
            OVERLAY.times = coverTime
    })
    }
}

function getOverlayTime(){
    return fetch('http://127.0.0.1:5000/get_potential_seizure_timestamps?url='+location.href, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
        })
        .then(response => response.json())
        .then(data => {
            for(let i = 0; i < data['result'].length; i++) {
                if (data['result'][i][1] === true) {
                    alert("There are potential seizure trigger warnings in this video that will be filtered by ESV. Viewers Discretion is advised.")
                    break
                }
            }
            let loaderCover = document.getElementsByClassName('loader-cover')
            loaderCover[0].style.display = "none";
            return data['result']

        })
}


function coverFilter(coverTime){

    let covers = document.getElementsByClassName('ESV')
    let youTubeVideos = document.getElementsByTagName("video");
    let youTubeVideo = youTubeVideos[0]

    if(covers.length == 0){
        let youTubeVideos = document.getElementsByTagName("video");
        if(youTubeVideos.length == 0){
            return
        }
        const cover = document.createElement('div');
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
        cover.style.paddingTop = "250px";
        
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
    while (OVERLAY['state'] < OVERLAY['times'].length && currtime >= OVERLAY['times'][OVERLAY['state']][0]){
        coverFilter(OVERLAY['times'][OVERLAY['state']][1])
        OVERLAY['state'] += 1
    }
}

setInterval(() => {
    if (!isLoaderDisplayedYet) {
        displayLoader();
        isLoaderDisplayedYet = true;
    }

    if (CURRENT_PAGE != location.href) {
        CURRENT_PAGE = location.href;
        navigate();
    }
}, 1000)

setInterval(() => {
    activateCover()
}, 50)