import Image from "next/image";
import { Inter } from "next/font/google";
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import dynamic from "next/dynamic";
const inter = Inter({ subsets: ["latin"] });

const map = dynamic(() => import("./screens/map"), {ssr: false})

export default function Home() {
  return (
    <main>
      <map></map>
    </main>
  //   <main className={`bg-white ${inter.className}`}>
  //     <style jsx>{`
  //       .input-style {
  //         height: 70px;
  //         width: 405px;
  //         padding-left: 15px;
  //         padding-right: 15px;
  //         border: 1px solid #CCCCCC;
  //         border-radius: 8px;
  //         outline: none;
  //       }
  //       .input-style:focus {
  //         border-color: #999999;
  //       }
  //     `}</style>
  //     <div className="flex bg-white items-center justify-center p-24">
  //       <div className="flex" style={{ width: 1140, height: 670 }}>
  //         <div className="bg-white rounded-tl-[29px] rounded-bl-[29px] shadow-lg flex justify-center items-center" style={{ width: 570, height: '100%', flexDirection: 'column'}}>
  // {/* Konten pertama */}
  //           <div>
  //             <Image src="/Logo_BikeRent.png" width={287} height={200} />
  //           </div>
  //           <div className="text-left mt-6 font-bold text-[#EA7604] text-30" style={{ marginTop: 22, height: 20, width: 405,}}>
  //             <p>Lets Sign Up</p>
  //           </div>
  //           <div style={{ height: 70, width: 405, marginTop: 15, borderRadius: 8 }}>
  //             <input className="input-style pl-12" type="text" placeholder="fullname" style={{ height: 70, width: 405, paddingLeft: 15, paddingRight: 15, border: '1px solid #CCCCCC',borderRadius: 8 }} />
  //           </div>
  //           <div style={{height: 70, width: 405,marginTop: 15}}>
  //             <input className="input-style pl-12" type="text" placeholder="Email" style={{height: 70, width: 405, paddingLeft: 15, paddingRight: 15, border: '1px solid #CCCCCC',borderRadius: 8 }}/>
  //           </div>
  //           <div style={{height: 70, width: 405,marginTop: 15}}>
  //             <input className="input-style pl-12" type="text" placeholder="Password" style={{height: 70, width: 405, paddingLeft: 15, paddingRight: 15, border: '1px solid #CCCCCC',borderRadius: 8 }}/>
  //           </div>
  //           <div>
  //               <button className="flex justify-center items-center text-white font-bold" style={{ height: 70, width: 405, marginTop: 37, backgroundImage: 'linear-gradient(90deg, #EA7604 0%, #DC4919 100%)', borderRadius: 8 }}>
  //                 Sign In
  //               </button>
  //               <p className="flex justify-center items-center mt-2">Already have an account ?
  //                 <Link href={''}>
  //                   <b> Sign In</b>
  //                 </Link>
  //               </p>
  //           </div>
  //         </div>
  //         <div className="bg-[#EB7703] rounded-tr-[29px] rounded-br-[29px] shadow-lg" style={{ width: 570, height: '100%' }}>
  //           {/* Konten kedua */}
  //         </div>
  //       </div>
  //     </div>
  //   </main>
  );
}
