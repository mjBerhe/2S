import Head from 'next/head';
import Link from 'next/link';
import io from 'socket.io-client';

export default function MyApp() {
    return (
        <div className="container">
            <Head>
                <title>hehe xD</title>
                <link rel="icon" type="image/png" href="/omega.png" />
            </Head>

            <div>
                <h1>
                    Join the <Link href="/chatroom"> 
                                <a>chatroom</a>
                             </Link>
                </h1>
            </div>
        </div>
    )
}
