// const fs = require("fs");
const ytdl = require("ytdl-core");
const express = require("express");
let cors = require("cors");
let path = require("path");
const app = express();
const helmet = require("helmet");

let http = require("http").createServer(app);
const io = require("socket.io")(http);

const por = process.env.PORT || 5000;

let clientGlob = null;
const buttonSearchMusic = document.getElementById('search-music');
buttonSearchMusic.addEventListener('onclick', () =>{
    searchMusic();
})

function searchMusic()
{
    let input = document.getElementById("search-input");
    let video =  document.getElementById("video-youtube");

    if (!input.value) { return ''; }
    if(input.value){
    input.value = input.value.replace('watch?v=','embed/');
    }
    
    video.src = input.value;
   // getAudio()
}


getAudio = (videoURL, res) => {
    console.log(videoURL);
    let stream = ytdl(videoURL, {
        quality: "highestaudio",
        filter: "audioonly",
    })
    .on("progress", (chunkSize, downloadedChunk, totalChunk) =>{
        clientGlob.emit("progressEventSocket", [
            (downloadedChunk * 100)/ totalChunk,
        ]);
        clientGlob.emit("downloadCompletedServer", [downloadedChunk]);
        if(downloadedChunk == totalChunk)
        {
            console.log("Downloaded");
        }
    })
    .pipe(res);

    ytdl.getInfo(videoURL).then((info) =>{
        console.log("title:", info.videoDetails.title);
        console.log("rating:", info.player_response.videoDetails.averageRating);
        console.log("uploaded by:", info.videoDetails.author.name);
        clientGlob.emit("videoDetails", [
            info.videoDetails.title,
            info.videoDetails.author.name,
        ])
    })
};

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(
    helmet({
      xFrameOptions: { action: "sameorigin" },
    }),
  );

app.post("/", (req,res) =>{
    getAudio(req.body.url, res);
});

io.on("connection", (client) => {
    clientGlog = client;
    console.log("User connected");
});

http.listen(port, () =>{
    console.log(`Example app listening at http://localhost${port}`)
});

