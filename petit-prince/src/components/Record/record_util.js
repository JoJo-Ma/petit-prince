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




export {setupMic};
