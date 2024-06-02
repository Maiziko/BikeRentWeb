import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from "next/image";
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import { firebaseAuth, firestore } from '@/config/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

export default function SignUp() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [inputs, setInputs] = useState({
        fullname: '',
        email: '',
        password: '',
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs((prevInputs) => ({
            ...prevInputs,
            [name]: value,
        }));
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        try {
            const { fullname, email, password } = inputs;

            // Create user with email and password
            const success = await createUserWithEmailAndPassword(firebaseAuth, email, password);
            const userId = success.user.uid;

            // Send email verification
            await sendEmailVerification(firebaseAuth.currentUser);

            // Save user data to Firestore
            const userData = {
                userId: userId,
                email: email,
                fullname: fullname,
            };
            await firestore.collection('users').doc(userId).set(userData);

            // Redirect to sign-in page after successful registration
            router.replace('/signin');
        } catch (error) {
            console.error('Error registering user:', error.message);
            // Handle error here
            // Show user-friendly error message
            alert(`Error registering user: ${error.message}`);
        }finally{
            console.log("berhasil");
            alert("Berhasil mendaftar silahkan check email anda");
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    return (
        <main className="bg-white">
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
                    <div className="bg-white rounded-tl-[29px] rounded-bl-[29px] shadow-lg flex justify-center items-center" style={{ width: 570, height: '100%', flexDirection: 'column', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.2)'}}>
                        <div>
                            <Image src="/Logo_BikeRent.png" width={287} height={200} />
                        </div>
                        <div className="text-left mt-6 font-bold text-[#EA7604] text-30" style={{ marginTop: 22, height: 20, width: 405,}}>
                            <p>Lets Sign Up</p>
                        </div>
                        <form onSubmit={handleSignUp}>
                            <div style={{ height: 70, width: 405, marginTop: 15, borderRadius: 8 }}>
                                <FontAwesomeIcon icon={faUser} className="icon text-gray-400 m-7" style={{position: 'absolute'}} />
                                <input className="input-style pl-12" type="text" name="fullname" placeholder="fullname" value={inputs.fullname} onChange={handleChange} style={{ height: 70, width: 405, paddingLeft: 65, paddingRight: 15, border: '1px solid #CCCCCC',borderRadius: 8 }}/>
                            </div>
                            <div style={{height: 70, width: 405,marginTop: 15}}>
                                <FontAwesomeIcon icon={faEnvelope} className="icon text-gray-400 m-7" style={{position: 'absolute'}}/>
                                <input className="input-style pl-12" type="email" name="email" placeholder="Email" value={inputs.email} onChange={handleChange} style={{ height: 70, width: 405, paddingLeft: 65, paddingRight: 15, border: '1px solid #CCCCCC',borderRadius: 8 }}/>
                            </div>
                            <div style={{height: 70, width: 405,marginTop: 15}}>
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="icon text-gray-400 m-7" onClick={togglePasswordVisibility} style={{ position: 'absolute', cursor: 'pointer' }} />
                                <input type={showPassword ? 'text' : 'password'} className="input-style pl-12" name="password" placeholder="Password" value={inputs.password} onChange={handleChange} style={{ height: 70, width: 405, paddingLeft: 65, paddingRight: 15, border: '1px solid #CCCCCC',borderRadius: 8 }}/>
                            </div>
                            <div>
                                <button type="submit" className="flex justify-center items-center text-white font-bold shadow-[#7D7979] shadow-md" style={{ height: 70, width: 405, marginTop: 37, backgroundImage: 'linear-gradient(90deg, #EA7604 0%, #DC4919 100%)', borderRadius: 8 }}>
                                    Sign Up
                                </button>
                                <p className="flex justify-center items-center mt-2 ">Already have an account ? 
                                    <Link href={'/screens/signin'}>
                                        <b> Sign In</b>
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                    <div className="bg-[#EB7703] rounded-tr-[29px] rounded-br-[29px] shadow-lg" style={{ width: 570, height: '100%', backgroundImage: 'linear-gradient(180deg, #EA7604 0%, #DC4919 100%)', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.2)' }}>
                        {/* Konten kedua */}
                    </div>
                </div>
            </div>
        </main>
    );
}
