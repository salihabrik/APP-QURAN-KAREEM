const apiUrl = 'https://mp3quran.net/api/v3';
const reciters = 'reciters';
const language ='ar'

async function getReciters() {   
    const chooseReciter  = document.querySelector('#chooseReciter'); 
    const res = await fetch(`${apiUrl}/${reciters}?language=${language}`)  ;
    const data = await res.json();
    chooseReciter.innerHTML = '<option value="">اختر القارئ</option>';
    data.reciters.forEach(reciter => 
    chooseReciter.innerHTML += `<option value="${reciter.id}">${reciter.name}</option>`);

    chooseReciter.addEventListener('change',
     (event) => getMoshaf(event.target.value));
}    
getReciters()

async function getMoshaf(reciter) {
    const chooseMoshaf = document.querySelector('#chooseMoshaf');
    const res = await fetch(`${apiUrl}/reciters?language=${language}&reciter=${reciter}`);
    const data = await res.json();
    const moshafs = data.reciters[0].moshaf
    chooseMoshaf.innerHTML = '<option value="">اختر المصحف</option>';
    moshafs.forEach(moshaf => {
        chooseMoshaf.innerHTML += `<option value="${moshaf.id}"data-server=${moshaf.server}" data-surahList="${moshaf.surah_List}">${moshaf.name}</option>`;
        console.log(moshaf);
    });

    chooseMoshaf.addEventListener('change', event => {
        const selectedMoshaf = chooseMoshaf.options[chooseMoshaf.selectedIndex];
        const surahServer = selectedMoshaf.dataset.server;
        const surahList = selectedMoshaf.dataset.surahlist;
        getSurah(surahServer, surahList);
       
    });
}

async function getSurah(surahServer, surahList) {
    const chooseSurah = document.querySelector('#chooseSurah')

    const res = await fetch(`https://mp3quran.net/api/v3/suwar`)
    const data = await res.json();
    console.log('API res:', data);
    const suraNames = data.suwar;

    surahList = surahList.split(',');
    chooseSurah.innerHTML = '<option value="">اختر السورة</option>';
    surahList.forEach(surah => {
        const padSurah = surah.padStart(3, '0');
        suraNames.forEach(surahName => {
            console.log('Comparing:', surah, surahName.id);
            if (surahName.id == surah) {
                chooseSurah.innerHTML += `<option value="${surahServer}${padSurah}.mp3">${surahName.name}</option>`
                
            }

        });
    });

    chooseSurah.addEventListener('change', event => {
        const selectedSurah = chooseSurah.options[chooseSurah.selectedIndex];
        playSurah(selectedSurah.value);
        console.log(selectedSurah.value);
    });
}
function playSurah(surahmp3) {
    const audioPlayer = document.querySelector('#audioPlayer');
audioPlayer.src = surahmp3;
    audioPlayer.play();
}


function playLive(channel) {
    if (Hls.isSupported) { // Remove parentheses here
        var video = document.getElementById('livevideo');
        var hls = new Hls();
        hls.loadSource(`${channel}`);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            video.play();
        });
    } else {
        // hls.js is not supported on platforms that do not have Media Source Extensions (MSE) enabled.
        // When the browser has built-in HLS support (check using `canPlayType`), we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video element through the `src` property.
        // This is using the built-in support of the plain video element, without using hls.js.
        var video = document.getElementById('livevideo');
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = 'https://d26g5bnklkwsh4.cloudfront.net/adf856d9-a233-484b-a730-f7ac57c53aa5/master.m3u8';
            video.addEventListener('canplay', function () {
                video.play();
            });
        }
    }
}

