import { useState } from 'react';
import Image from "next/image";
import { Inter } from "next/font/google";
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';

const inter = Inter({ subsets: ["latin"] });

export default function SignIn() {
    const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <main className={`bg-white ${inter.className}`}>
      <style jsx>{`
        .input-style {
          height: 70px;
          width: 405px;
          padding-left: 15px;
          padding-right: 15px;
          border: 1px solid #CCCCCC;
          border-radius: 8px;
          outline: none;
        }
        .input-style:focus {
          border-color: #999999;
        }
      `}</style>
      <div className="flex bg-white items-center justify-center p-24">
        <div className="flex" style={{ width: 1140, height: 670 }}>
            <div className="bg-[#EB7703] rounded-tl-[29px] rounded-bl-[29px] shadow-lg" style={{ width: 570, height: '100%', backgroundImage: 'linear-gradient(180deg, #EA7604 0%, #DC4919 100%)', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.2)' }}>
            {/* Konten kedua */}
          </div>
          <div className="bg-white rounded-tr-[29px] rounded-br-[29px] shadow-lg flex justify-center items-center" style={{ width: 570, height: '100%', flexDirection: 'column', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.2)'}}>
  {/* Konten pertama */}
            <div>
              <Image src="/Logo_BikeRent.png" width={287} height={200} />
            </div>
            <div className="text-left mt-6 font-bold text-[#EA7604] text-30" style={{ marginTop: 80, height: 20, width: 405,}}>
              <p>Lets Sign In</p>
            </div>
            
            <div style={{height: 70, width: 405,marginTop: 15 }}>
                {/* <FontAwesomeIcon icon={faUser} className="icon text-gray-400 m-7" style={{position: 'absolute'}} /> */}
                <FontAwesomeIcon icon={faEnvelope} className="icon text-gray-400 m-7" style={{position: 'absolute'}}/>
                <input className="input-style pl-12" type="text" placeholder="Email" style={{height: 70, width: 405, paddingLeft: 65, paddingRight: 15, border: '1px solid #CCCCCC',borderRadius: 8 }}></input>
            </div>
            <div style={{height: 70, width: 405,marginTop: 15}}>
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="icon text-gray-400 m-7" onClick={togglePasswordVisibility} style={{ position: 'absolute', cursor: 'pointer' }} />
                <input type={showPassword ? 'text' : 'password'} className="input-style pl-12" placeholder="Password" style={{height: 70, width: 405, paddingLeft: 65, paddingRight: 15, border: '1px solid #CCCCCC',borderRadius: 8 }}/>
            </div>
            <div style={{ marginTop: 62 }}>
                <button className="flex justify-center items-center text-white font-bold shadow-[#7D7979] shadow-md" style={{ height: 70, width: 405, marginTop: 37, backgroundImage: 'linear-gradient(90deg, #EA7604 0%, #DC4919 100%)', borderRadius: 8 }}>
                  Sign In
                </button>
                <p className="flex justify-center items-center mt-2">Already have an account ?
                  <Link href={'/screens/signup'}>
                    <b> Sign Up</b>
                  </Link>
                </p>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
