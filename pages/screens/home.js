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
    <main style={{height: '100vh', width: '100vw'}}>
      <Map></Map>
    </main>
  );
}