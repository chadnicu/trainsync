import { useState, useEffect, useRef, ReactNode } from "react";

export default function LazyYoutube({ children }: { children: ReactNode }) {
  const [load, setLoad] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setLoad(true);
        observer.disconnect();
      }
    });

    observer.observe(videoRef.current!);

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current!);
      }
    };
  }, []);

  return <div ref={videoRef}>{load ? children : <div>Loading...</div>}</div>;
}
