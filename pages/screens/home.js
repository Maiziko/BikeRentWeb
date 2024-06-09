import Image from "next/image";
import { Inter } from "next/font/google";
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import dynamic from "next/dynamic";
const inter = Inter({ subsets: ["latin"] });

const Map = dynamic(() => import("./map"), {ssr: false})

export default function Home() {
  return (
    <main style={{position: 'relative', height: '100vh', width: '100vw'}}>
      <Map></Map>
      <div style={{padding: '20px', height: '100vh', position: 'absolute', left: 0, top: 0, backgroundColor: 'white', zIndex: 9999, borderTopRightRadius: 20, borderBottomRightRadius: 20 }}>
        <Link style={{display: 'block'}} href={'/screens/home'}>Home</Link>
        <Link style={{display: 'block', marginTop: 20}} href={'/screens/history'}>History</Link>
        <Link style={{display: 'block', marginTop: 20}} href={'/screens/notification'}>Notification</Link>
        <Link style={{display: 'block', marginTop: 20}} href={'/screens/profil'}>Profile</Link>
      </div>
    </main>
  );
}