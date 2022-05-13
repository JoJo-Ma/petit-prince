import {useState, useEffect, useRef, useContext} from 'react';

function useOnScreen(ref) {
  const [isOnScreen, setIsOnScreen] = useState(false);
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(([entry]) =>
      setIsOnScreen(entry.isIntersecting)
    , {rootMargin:'50% 0px -50% 0px'});
  }, []);

  useEffect(() => {
    if (ref.current === null) return
    observerRef.current.observe(ref.current);
    return () => {
      observerRef.current.disconnect();
    };
  }, [ref.current]);

  return isOnScreen;
}

export default useOnScreen;
