const buttonSearchMusic = document.getElementById('search-music');
const buttonTranscribe = document.getElementById('transcribe');
const transcriptionArea = document.getElementById('transcription-area');

let input = document.getElementById("search-input");
let video =  document.getElementById("video-youtube");
let originalAudio='';


function searchMusic()
{
    originalAudio = input.value;
    if (!input.value) { return ''; }
    if(input.value){
    input.value = input.value.replace('watch?v=','embed/');
    }
    
    video.src = input.value;
   
}


function getAudio(videoUrl) {
    if (!videoUrl) return;

    fetch('/api/transcribe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: videoUrl })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Transcrição:", data.transcription);
        const transcriptionArea = document.getElementById('transcriptionArea');
        transcriptionArea.innerHTML = `<p>${data.transcription}</p>`;
    })
    .catch(error => {
        console.error("Erro ao transcrever:", error);
        alert("Erro ao transcrever o vídeo.");
    });
}



buttonSearchMusic.addEventListener('click', () =>{
    searchMusic();
})

buttonTranscribe.addEventListener('click', () =>
{
    if(originalAudio){
        getAudio( originalAudio);
        //originalAudio = '';
    }
})

