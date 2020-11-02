import { useState, useEffect } from 'react';

export default function useCountdown(initialTime, onComplete) {

   const [countdown, setCountdown] = useState({
      start: false,
      initialTime: initialTime,
      currentTime: initialTime,
   });

   useEffect(() => {
      if (countdown.start) {
         if (countdown.currentTime > 0) {
            setTimeout(() => {
               setCountdown(prevCountdown => ({
                  ...prevCountdown,
                  currentTime: prevCountdown.currentTime - 1,
               }));
            }, 1000);
         } else if (countdown.currentTime === 0) {
            setCountdown(prevCountdown => ({
               ...prevCountdown,
               start: false,
               currentTime: prevCountdown.initialTime,
            }));
            onComplete();
         }
      }
   }, [countdown]);

   const startCountdown = () => {
      setCountdown(prevCountdown => ({
         ...prevCountdown,
         start: true,
      }));
   }

   return [countdown, startCountdown];
}