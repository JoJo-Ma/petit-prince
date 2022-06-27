import { useEffect, useState } from 'react';

const useFetchTransCustom = () => {
    const [language, setLanguage] = useState()
    const [words, setWords] = useState()
    const [transcription, setTranscription] = useState()
    const [mouse, setMouse] = useState({
        x: null,
        y: null
    })
    
    const printSelection = () => {
        if(!document.getSelection().focusNode) return;
        const selectedWord = document.getSelection().toString()
        const selectedLanguage = document.getSelection().focusNode.parentElement.lang
        setLanguage(selectedLanguage)
        setWords(selectedWord)
    }

    // listen for selection
    useEffect(() => {
        document.addEventListener('selectionchange', printSelection);
        return () => {
            document.removeEventListener('selectionchange', printSelection);
        };
    })

    const mousemove = (e) => {
        if (e.clientX !== mouse.x && e.clientY !== mouse.y) {
            setTranscription(null)
        }
        setMouse({
            x: e.clientX,
            y: e.clientY,
        })
    }

    useEffect(() => {
        window.addEventListener('mousemove', mousemove);
        return (params) => {
            window.removeEventListener('mousemove', mousemove);
        }
    })

    
    

    useEffect(() => {
        const fetchPinYin = async () => {
            const response = await fetch (`http://localhost:3005/transcustom/mandarin/${words}`, {
              method: "GET",
              headers: {token : localStorage.token}
            })
      
            const parseRes = await response.json()
            setTranscription(parseRes.text)
          }
          if(!language || !words) return
          if (language === "Mandarin") {
              const timer = setTimeout(() => fetchPinYin(), 500)
              return () => clearTimeout(timer)
            }
    }, [language, words])




    return {mouse, transcription}
}

export default useFetchTransCustom