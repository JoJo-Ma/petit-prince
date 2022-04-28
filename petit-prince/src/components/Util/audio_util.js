import lamejs from 'lamejs';

const setupMic = async (constraints = { audio : true }) => {
    try {
      console.log('setup');
      return await navigator.mediaDevices.getUserMedia(constraints);
    } catch(err) {
      console.error(err.message);
    }
  }

const convertBlobToAudioBuffer = (blob, context) => {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader()
      fileReader.onload = () => {
        const arrayBuffer = fileReader.result
        context.decodeAudioData(arrayBuffer, (audioBuffer) => {
          resolve(audioBuffer)
        })

      }

      fileReader.onerror = reject

      fileReader.readAsArrayBuffer(blob)
    })
  }

const convertWavToMp3 = async (blob, context) => {
  // channels 1 for mono
  const CHANNELS = 1
  const SAMPLE_RATE = 48000
  const KBPS = 128
  var mp3encoder = new lamejs.Mp3Encoder(CHANNELS, SAMPLE_RATE, KBPS);
  var mp3Data=[]
  var audioBuffer = await convertBlobToAudioBuffer(blob, context)
  let samples = audioBuffer.getChannelData(0).map(x => x * 32767.5);
  const encoded = mp3encoder.encodeBuffer(samples);
  mp3Data.push(encoded);
  mp3Data.push(mp3encoder.flush());
  return new Blob(mp3Data, {type: 'audio/mp3'});
}


const play = (buffer, audioContext) => {
  let sourceNode = audioContext.createBufferSource();
  sourceNode.playbackRate.value = 1
  sourceNode.buffer = buffer
  sourceNode.connect(audioContext.destination)
  sourceNode.start(0)
}


export {setupMic, convertBlobToAudioBuffer, play, convertWavToMp3};
