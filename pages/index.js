import Head from 'next/head';
import Link from 'next/link';

export default function MyApp() {
   return (
      <div className="container">
         <Head>
            <title>hehe xD</title>
            <link rel="icon" type="image/png" href="/omega.png" />
         </Head>
         <div>
            <h1>
               Join the <Link href="/gamelobby"><a>game lobby</a></Link>
            </h1>
            <h1>
               Join the <Link href="/chatlobby"><a>chat lobby</a></Link>
            </h1>
         </div>
      </div>
   )
}
