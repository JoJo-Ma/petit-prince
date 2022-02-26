import React, { useEffect } from 'react';

export default ({loadData}) => {

  useEffect(() => {
    document.getElementById('file-selector').addEventListener('change', (e) => {
      try {
        const file = e.target.files[0];
        if(file.type !== "application/json") {
          console.log("incorrect file format");
          return
        }
        const readFile = new FileReader();
        readFile.onload = (e) => {
          const data = e.target.result
          const json = JSON.parse(data)
          console.log(json.urlInput);
          loadData(json)
        }
        readFile.readAsText(file)
        document.getElementById('file-selector').value = ""
      } catch (error) {
        console.log(error.message);
      }
    })
  }, [])


  return (
    <>
      <p>Load file</p>
      <input type="file" id="file-selector" accept=".json" />
    </>
  )
}
