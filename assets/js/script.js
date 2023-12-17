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
   
    chooseReciter.addEventListener('change', (event) => getMoshaf(event.target.value));
}    
getReciters()

async function getMoshaf(reciter) {
    const chooseMoshaf = document.querySelector('#chooseMoshaf');
    await fetch(`${apiUrl}/reciters?language=${language}&reciter=${reciter}`);
    const data = await response.json();
    const moshafs = data.reciters[0].moshafs;
    chooseMoshaf.innerHTML = '<option value="">اختر المصحف</option>';
    moshafs.forEach(moshaf => {
        chooseMoshaf.innerHTML += `<option value="${moshaf.id}"data-server="${moshaf.server}";data-suralist="${moshaf.suralist}">${moshaf.name}</option>`;
    });

    chooseMoshaf.addEventListener('change', () => {
        const selectMoshaf = chooseMoshaf.options[chooseMoshaf.selectedIndex];
        const surahServer = selectMoshaf.dataset.server;
        const surahList = selectMoshaf.dataset.suralist;
        getSurah(surahServer, surahList);
    });
}

async function getSurah(surahServer, surahList) {
    const chooseSurah = document.querySelector('#chooseSurah');

    const res = await fetch(`https://mp3quran.net/api/v3/suwar`);
    const data = await res.json();
    const suraNames = data.suwar;

    surahList = surahList.split(',');
    chooseSurah.innerHTML = '<option value="">اختر السورة</option>';
    surahList.forEach(surah => {
        suraNames.forEach(surahName => {
            if (surahName.id == surah) {
                chooseSurah.innerHTML += `<option value="${surahName.id}">${surahName.name}</option>`;
            }
        });
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
function playLive(channel){
    if (hls.isSupported) {
        var video = document.getElementById('LiveVideo');
        var hls = new hls();
        hls.loadSource(`${channel}`);
        hls.attachMedia(video);
        hls.on(hls.Events.MANIFEST_PARSED,function() {
          video.play();
      });
    }
}
