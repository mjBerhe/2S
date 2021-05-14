import Head from 'next/head';
import Link from 'next/link';

export default function MyApp() {

   const handleButton = (e) => {
      e.preventDefault();
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
               <h3>2S</h3>
               <h3>Create Account</h3>
            </nav>
            <div className='quote-button'>
               <div className='quote'>
                  <h1>Insert motivational yet provacative quote.</h1>
               </div>
               <button className='button' onClick={handleButton}>
                  <h2>Play Now</h2>
               </button>
            </div>
            
         </div>
      </div>
   )
}


{/* <Link href="/gamelobby">
<a className='link-text'>Play Now</a>
</Link>
</button> */}
