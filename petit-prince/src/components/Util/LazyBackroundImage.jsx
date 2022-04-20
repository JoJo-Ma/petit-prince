import React, { useState, useEffect } from 'react';

const useProgressiveImage = src => {
  const [sourceLoaded, setSourceLoaded] = useState(null)


  useEffect(() => {
    const img = new Image()
    img.src = src
    img.onload = () => setSourceLoaded(src)
  }, [src])

  return sourceLoaded
}

const LazyBackroundImage = (props) => {
  const loaded = useProgressiveImage(props.source)


  const handleStyle = !props.options ?
  { backgroundImage: `url(${loaded || props.placeholder})` }
  :
  { backgroundImage: `${props.options},url(${loaded || props.placeholder})` }

  return (
  <div className={props.className} id={props.id} style={handleStyle}>{props.children}</div>
  )
}

export default LazyBackroundImage;
