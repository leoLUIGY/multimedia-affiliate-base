const buttonSearchMusic = document.getElementById('search-music');
const buttonTranscribe = document.getElementById('transcribe');

let input = document.getElementById("search-input");
let video =  document.getElementById("video-youtube");

buttonSearchMusic.addEventListener('onclick', () =>{
    searchMusic();
})

buttonTranscribe.addEventListener('onclick', () =>
{
    getAudio( video.src);
})

function searchMusic()
{
    
    if (!input.value) { return ''; }
    if(input.value){
    input.value = input.value.replace('watch?v=','embed/');
    }
    
    video.src = input.value;
   // getAudio()
}
