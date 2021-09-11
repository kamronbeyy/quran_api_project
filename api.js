let audio = document.querySelector('.quranPlayer');
let surahsContainer = document.querySelector('.surahs');
let ayah = document.querySelector('.ayah');
let next = document.querySelector('.next');
let prev = document.querySelector('.prev');
let play = document.querySelector('.play');

// Fetch Api Quran
function getSurahs(){
    fetch('https://api.quran.sutanlab.id/surah')
    .then(response => response.json())
    .then(data => {
        for(let surah in data.data){
            surahsContainer.innerHTML +=
             `<div>
                <p>${data.data[surah].name.long}</p>
                <p>${data.data[surah].name.transliteration.en}</p>
            </div>`
        }
        //select all surahs
        let allSurahs = document.querySelectorAll('.surahs div'),AyahsAudios, 
        AyahsText;
        allSurahs.forEach((surahs, index) =>{
           surahs.addEventListener('click', e =>{
               fetch(`https://api.quran.sutanlab.id/surah/${index + 1}`)
               .then(response => response.json())
               .then(data => {
                 let verses = data.data.verses;
                 AyahsAudios = [];
                 AyahsText = [];
                verses.forEach(verse =>{
                    AyahsAudios.push(verse.audio.primary);
                    AyahsText.push(verse.text.arab)
                })
               let AyahIndex = 0;
               changeAyah(AyahIndex);
               audio.addEventListener('ended', e =>{
                   AyahIndex++;
                  if(AyahIndex < AyahsAudios.length){
                    changeAyah(AyahIndex);
                  }else{
                      AyahIndex = 0;
                      changeAyah(AyahIndex);
                      audio.pause();

                      Swal.fire({
                          position: 'center',
                          icon: 'success',
                          title: 'Sura has been ended',
                          showConfirmButton: false,
                          timer: 1500
                      })
                      isPlaying = true;
                      togglePlay();
                      
                  }
               })
               next.addEventListener('click', e =>{
                  AyahIndex < AyahsAudios.length - 1 ? AyahIndex++ : AyahIndex - 0;changeAyah(AyahIndex)
               })
               prev.addEventListener('click', e =>{
                AyahIndex == 0 ? AyahIndex - AyahsAudios.length - 1 : AyahIndex--
                changeAyah(AyahIndex);
            })

            let isPlaying = false;
            togglePlay();
            function togglePlay(){
               if(isPlaying){
                    audio.pause();
                    play.innerHTML = `<i class="fas fa-play"></i> `;
                    isPlaying = false;
               }else{
                    audio.play();
                    play.innerHTML = `<i class="fas fa-pause"></i> `;
                    isPlaying = true;
               }
           }
           //play btn 
           play.addEventListener('click', togglePlay);

               function changeAyah(index){

                audio.src = AyahsAudios[index];
                ayah.innerHTML = AyahsText[index];
               }
               })
           })
        })
        
    })
}
getSurahs()