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



const play = (buffer, audioContext) => {
  let sourceNode = audioContext.createBufferSource();
  sourceNode.playbackRate.value = 1
  sourceNode.buffer = buffer
  sourceNode.connect(audioContext.destination)
  sourceNode.start(0)
}


export {setupMic, convertBlobToAudioBuffer, play};
