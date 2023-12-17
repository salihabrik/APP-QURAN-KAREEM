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
   
    chooseReciter.addEventListener('change', e => getMoshaf(e.target.value));
}    
getReciters()

async function getMoshaf() {
    const chooseMoshaf = document.querySelector('#chooseMoshaf');
    const response = await fetch(`${apiUrl}/reciters?language=${language}&reciters=${reciters}`);
    const data = await response.json();
    const moshafs = data.reciters[0].moshafs;

    chooseMoshaf.innerHTML = '<option value="">اختر المصحف</option>';
    moshafs.forEach(moshaf => {
        chooseMoshaf.innerHTML += `<option value="${moshaf.id}" data-server="${moshaf.server}" data-suralist="${moshaf.suralist}">${moshaf.name}</option>`;
    });

    chooseMoshaf.addEventListener('change', () => {
        const selectMoshaf = chooseMoshaf.options[chooseMoshaf.selectedIndex];
        const surahServer = selectMoshaf.dataset.server;
        const surahList = selectMoshaf.dataset.suralist;
        getSurah(surahServer, surahList);
    });
}


async function getSurah(surahList) {
    const chooseSurah = document.querySelector('#chooseSurah');

    // Fetch surah names from the API
    const surahResponse = await fetch(`${apiUrl}/suwar`);
    const surahData = await surahResponse.json();
    const suraNames = surahData.suwar;

    // Split the surahList into an array
    surahList = surahList.split(',');

    chooseSurah.innerHTML = '<option value="">اختر السورة</option>';

    // Iterate over each surah in the surahList
    surahList.forEach(surah => {
        // Find the corresponding surahName from the API data
        const surahName = suraNames.find(s => s.id == surah);

        if (surahName) {
            // Add the surah to the dropdown
            chooseSurah.innerHTML += `<option value="${surahName.id}">${surahName.name}</option>`;
        }
    });

    chooseSurah.addEventListener('change', () => {
        const selectSurah = chooseSurah.options[chooseSurah.selectedIndex];
        playSurah(selectSurah.value);
    });
}

function playSurah(surah) {
    const audioPlayer = document.querySelector('#audioPlayer');
    audioPlayer.src = `https://server8.mp3quran.net/${surah}/${surah}.mp3`;
    audioPlayer.play();
}

function playLive(channel) {
    if (Hls.isSupported) { // Note: Changed from hls to Hls
        var video = document.getElementById('LiveVideo');
        var hlsInstance = new Hls(); // Note: Changed from hls to Hls
        hlsInstance.loadSource(`${channel}`);
        hlsInstance.attachMedia(video);
        hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
            video.play();
        });
    }
}
