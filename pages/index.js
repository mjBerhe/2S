import Head from 'next/head';


export default function MyApp() {

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
            <div className='quote-button'>
               <div className='quote'>
                  <h1>Insert motivational yet provacative quote.</h1>
               </div>
               <button className='button button-main' onClick={handleButton}>
                  <h4>Play Now</h4>
               </button>
            </div>
            
         </div>
      </div>
   )
}
