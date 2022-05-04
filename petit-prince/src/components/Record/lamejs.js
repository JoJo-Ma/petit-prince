var gAudio= null;       //Audio context
var gAudioSrc= null;    //Audio source
var gNode= null;        //The audio processor node
var gIsLame= false;     //Has lame.min.js been loaded?
var gLame= null;        //The LAME encoder library
var gEncoder= null;     //The MP3 encoder object
var gStrmMp3= [];       //Collection of MP3 buffers
var gIsRecording= false;
var gCfg= {
  chnlCt:         1,
  bufSz:          4096,
  sampleRate:     44100,
  bitRate:        128
};
var gPcmCt= 0;
var gMp3Ct= 0;

function onPower(btn) {
  if(!gAudio) {
    PowerOn();
  } else {
    PowerOff();
  }
}

function PowerOn() {
  var caps= { audio: true };
  try {
    //Browser compatibility
    window.AudioContext= window.AudioContext || window.webkitAudioContext || AudioContext;
    navigator.getUserMedia= navigator.getUserMedia
      || navigator.webkitGetUserMedia
      || navigator.mozGetUserMedia
      || navigator.msGetUserMedia
      || MediaDevices.getUserMedia;
    if(!(gAudio= new window.AudioContext())) {
      log("ERR: Unable to create AudioContext.");
    } else {
      navigator.getUserMedia(caps,onUserMedia,onFail);
    }
  } 

}

function onUserMedia(stream) {
  if(!(gAudioSrc= gAudio.createMediaStreamSource(stream))) {
    log("ERR: Unable to create audio source.");
  } else if(!gIsLame) {
    log("Fetching lame library...");
    loadScript("lame","js/lame.min.js",LameCreate);
  } else {
    LameCreate();
  }
}

function LameCreate() {
  gIsLame= true;
  if(!(gEncoder= Mp3Create())) {
    log("ERR: Unable to create MP3 encoder.");
  } else {
    gStrmMp3= [];
    gPcmCt= 0;
    gMp3Ct= 0;
    log("Power ON.");
    document.getElementById('btnRecord').disabled= false;
    document.getElementById('btnStop').disabled= false;
  }
}

function onRecord(btn) {
  var creator;
  log("Start recording...");
  if(!gAudio) {
    log("ERR: No Audio source.");
  } else if(!gEncoder) {
    log("ERR: No encoder.");
  } else if(gIsRecording) {
    log("ERR: Already recording.");
  } else {
    if(!gNode) {
      if(!(creator= gAudioSrc.context.createScriptProcessor || gAudioSrc.createJavaScriptNode)) {
        log("ERR: No processor creator?");
      } else if(!(gNode= creator.call(gAudioSrc.context,gCfg.bufSz,gCfg.chnlCt,gCfg.chnlCt))) {
        log("ERR: Unable to create processor node.");
      }
    }
    if(!gNode) {
      log("ERR: onRecord: No processor node.");
    } else {
      gNode.onaudioprocess= onAudioProcess;
      gAudioSrc.connect(gNode);
      gNode.connect(gAudioSrc.context.destination);
      gIsRecording= true;
      log("RECORD");
    }
  }
}

function onStop(btn) {
  log("Stop recording...");
  if(!gAudio) {
    log("ERR: onStop: No audio.");
  } else if(!gAudioSrc) {
    log("ERR: onStop: No audio source.");
  } else if(!gIsRecording) {
    log("ERR: onStop: Not recording.");
  } else {
    gAudioSrc.disconnect(gNode);
    gNode.disconnect();
    gIsRecording= false;
    var mp3= gEncoder.flush();
    if(mp3.length>0)
      gStrmMp3.push(mp3);
    showMp3(gStrmMp3);
    log("STOP");
  }
}

function onAudioProcess(e) {
  var inBuf= e.inputBuffer;
  var samples= inBuf.getChannelData(0);
  var sampleCt= samples.length;
  var samples16= convertFloatToInt16(samples);
  if(samples16.length > 0) {
    gPcmCt+= samples16.length*2;
    var mp3buf= gEncoder.encodeBuffer(samples16);
    var mp3Ct= mp3buf.length;
    if(mp3Ct>0) {
      gStrmMp3.push(mp3buf);
      gMp3Ct+= mp3Ct;
    }
    status("%d / %d: %2.2f%%",gPcmCt,gMp3Ct,(gMp3Ct*100)/gPcmCt);
  }
}

function Mp3Create() {
  if(!(gLame= new lamejs())) {
    log("ERR: Unable to create LAME object.");
  } else if(!(gEncoder= new gLame.Mp3Encoder(gCfg.chnlCt,gCfg.sampleRate,gCfg.bitRate))) {
    log("ERR: Unable to create MP3 encoder.");
  } else {
    log("MP3 encoder created.");
  }
  return(gEncoder);
}

function convertFloatToInt16(inFloat) {
  var sampleCt= inFloat.length;
  var outInt16= new Int16Array(sampleCt);
  for(var n1=0;n1<sampleCt;n1++) {
    //This is where I can apply waveform modifiers.
    var sample16= 0x8000*inFloat[n1];
    sample16= (sample16 < -32767) ? -32767 : (sample16 > 32767) ? 32767 : sample16;
    outInt16[n1]= sample16;
  }
  return(outInt16);
}

function showMp3(mp3) {
  //Consolidate the collection of MP3 buffers into a single data Blob.
  var blob= new Blob(gStrmMp3,{type: 'audio/mp3'});
  //Create a URL to the blob.
  var url= window.URL.createObjectURL(blob);
  var audio= document.getElementById('AudioPlayer');
  var download= document.getElementById('DownloadLink');
  audio.src= url;
  download.href= url;
}
