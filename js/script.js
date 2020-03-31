let Plauer = [];
Plauer.playlist=[];
Plauer.playlist.name=[];
Plauer.playlist.file=[];
Plauer.playlist.timer=[];
Plauer.playlist.size=-1;
Plauer.plauer=new Audio('');
Plauer.current=-1;
Plauer.status="pause";
Plauer.nextTrack=nextTrack;
Plauer.previous=previousTrack;
Plauer.animation=getByQuery('.playlist').children[0];
Plauer.animationStatus=0;
Plauer.Volum=Plauer.plauer.volume;
getByQuery('.progress_Volum_container_percentage').style.width =Plauer.Volum*100 + '%';

//alert("Проверка");

let timer;


function showFile(){
    let input= document.querySelector('input[type=file]');
    for(let i=0;i<input.files.length;i++){
        let file = input.files[i];
        AddElements(file);
    }
}

function AddElements(file){    
    let a= new Audio(URL.createObjectURL(file));
    a.addEventListener('loadedmetadata', function (){
        Plauer.playlist.name.push(file.name);
        Plauer.playlist.file.push(URL.createObjectURL(file));
        let picHolder = document.getElementById("playlist");
        let div = document.createElement("div");
        div.className="fileEntity";
        let p = document.createElement("p");
        p.innerHTML=file.name;
        div.appendChild(p);
        let div2 = document.createElement("div");
        div2.className="fileEntity_duration";
        div2.innerHTML="--:--";
        div.appendChild(div2);
        let div3 = document.createElement("div");
        div3.className="fileEntity_duration";
        div3.innerHTML="--:--";
        div.appendChild(div3);
        div.setAttribute("onclick",`Play(${Plauer.playlist.name.length-1})`);
        picHolder.appendChild(div);
        getByQuery('.playlist').children[Plauer.playlist.name.length-1].children[1].textContent = prettifyTime(a.duration);
        Plauer.playlist.timer.push(a.duration);  
    });
}

function PlayStop(){
        Plauer.plauer.addEventListener('ended', function (){
        PlayPause();
        clearInterval(timer);
      });
}

function htmlTimUp2() {    
    getByQuery('.progress_bar_container_percentage').style.width = (Plauer.plauer.currentTime/Plauer.playlist.timer[Plauer.current])*100 + '%';
    getByQuery('.playlist').children[Plauer.current].children[2].textContent = prettifyTime(Plauer.plauer.currentTime);
    getByQuery('.progress_bar_container_percentage').style.width = (Plauer.plauer.currentTime/Plauer.playlist.timer[Plauer.current])*100 + '%';
}

function PlayPause(){
let playPause = getByQuery('.play_pause .play_pause_icon');
    if(Plauer.status=="play"){
        Plauer.status="pause";
        Plauer.plauer.pause();
        playPause.classList.toggle('play_pause-play');
        playPause.classList.toggle('play_pause-pause');
    }
    else{
        Plauer.status="play"; 
        playPause.classList.toggle('play_pause-play'); 
        playPause.classList.toggle('play_pause-pause');
        if(Plauer.plauer.currentTime<Plauer.playlist.timer[Plauer.current]){
            Plauer.plauer.play();
        }else{
            Play(Plauer.current);
       }
    }
}

function Play(i){
    Plauer.plauer.pause();
    Plauer.current=i;
    Plauer.plauer= new Audio(Plauer.playlist.file[Plauer.current]);
    PlayStop();
    if(Plauer.status=="pause"){
        PlayPause();
    }else{
        Plauer.plauer.play();
    }
    if(Plauer.animationStatus==0){
    Plauer.animation=getByQuery('.playlist').children[Plauer.current];
    Plauer.animation.classList.toggle('fileEntity-active');
    Plauer.animationStatus=1;
    }else{
    Plauer.animation.classList.toggle('fileEntity-active');
    Plauer.animation=getByQuery('.playlist').children[Plauer.current];
    Plauer.animation.classList.toggle('fileEntity-active');
    }
    getByQuery('.progress_bar_title').textContent = Plauer.playlist.name[i];
    Plauer.plauer.volume=Plauer.Volum;
    getByQuery('.progress_Volum_container_percentage').style.width =Plauer.Volum*100 + '%';
    timer=setInterval(htmlTimUp2,100);
}

function nextTrack(){
    Plauer.current=(Plauer.current+1)%Plauer.playlist.file.length;
    Play(Plauer.current);
};

function previousTrack(){
    Plauer.current--;
    if(Plauer.current==-1){
        Plauer.current+=Plauer.playlist.file.length;
    }
    Play(Plauer.current);
};

function nextProgress(){
    let e=getByQuery('.progress_bar_container_percentage');
    let coords = e.getBoundingClientRect().left;
    let progressBar = getByQuery('.progress_bar_stripe');
    let newPercent = Plauer.playlist.timer[Plauer.current]*((event.clientX - coords)/progressBar.offsetWidth);
    Plauer.plauer.currentTime=newPercent;
}

function Volum(){
    let e=getByQuery('.progress_Volum_container_percentage');
    let coords = e.getBoundingClientRect().left;
    let progressBar = getByQuery('.progress_Volum_stripe');
    let newPercent =((event.clientX - coords)/progressBar.offsetWidth);
    getByQuery('.progress_Volum_container_percentage').style.width =newPercent*100 + '%';
    Plauer.plauer.volume=newPercent;
    Plauer.Volum=newPercent;
}


function getByQuery(elem) {
  return typeof elem === 'string' ? document.querySelector(elem) : elem;
}

function prettifyTime(time) {
  var minutes = ~~(time % 3600 / 60);
  var seconds = ~~(time % 60);
  return '' + parseInt(minutes / 10) + minutes % 10 + ':' + parseInt(seconds / 10) + seconds % 10;
}


