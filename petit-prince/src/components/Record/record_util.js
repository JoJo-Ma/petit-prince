const getMedia = async (constraints = { audio : true }) => {
    try {
      return await navigator.mediaDevices.getUserMedia(constraints);
    } catch(err) {
      console.error(err.message);
    }
  }


const setupMic = () => {
  return getMedia()
}

const start = () => {
  setupMic()
}

const stopMic = (stream = window.localStream) => {
  stream.getTracks().forEach(track => {
    track.stop()
    track.enabled = false;
    stream.removeTrack(track);
  } )
  stream = null
}


export {setupMic, stopMic};
