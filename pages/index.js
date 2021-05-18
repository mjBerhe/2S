import { useState, useEffect } from 'react';
import useWindowSize from '../hooks/useWindowSize';
import Head from 'next/head';

export default function MyApp() {

   const [width, height] = useWindowSize();
   const [buttonClass, setButtonClass] = useState('');
   let baseButtonClass = 'button button-main';

   useEffect(() => {
      if (width > 850) setButtonClass(baseButtonClass + ' button-xl');
      if (width > 600 && width <= 850) setButtonClass(baseButtonClass + ' button-lg');
      if (width <= 600) setButtonClass(baseButtonClass + ' button-sm');
   }, [width])
   
   const handleButton = () => {
      location.href = "/gamelobby";
   }

   return (
      <div className="landing-page-container">
         <Head>
            <title>Lobby</title>
            <link rel="icon" type="image/png" href="/omega.png" />
         </Head>

         <div className='landing-page-content'>
            <nav>
               <h4>2S</h4>
               <h4>Create Account</h4>
            </nav>

            {/* <h3>{`width: ${width} x height: ${height}`}</h3> */}

            <div className='quote-button'>
               <div className='quote'>
                  <h1>Insert motivational yet provacative quote.</h1>
               </div>
               <button className={buttonClass} onClick={handleButton}>
                  <h4>Play Now</h4>
               </button>
            </div>
            
         </div>
      </div>
   )
}
