import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { firebaseAuth, firestore } from '@/config/firebase';

const Profile = () => {
    const router = useRouter();
    const { userId } = router.query;
    // alert(userId);
    const [dataUsers, setDataUsers] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = () => {
        signOut(firebaseAuth).then(() => {
            // Assuming destroyKey is imported and properly defined
            // destroyKey();
            router.replace('/screens/signin');
        });
    };

    useEffect(() => {
        const fetchData = async () => {

            setIsLoading(true);
            try {
                const docRef = doc(firestore, 'users', userId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    alert(userId); // Add this line
                    setDataUsers(docSnap.data());
                } else {
                    console.error('No such document!');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [userId]);


    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Set default values for imageUri and nomorTelp if they are empty
    // const imageUrl = dataUsers.imageUri ? dataUsers.imageUri : `https://ui-avatars.com/api/?name=${dataUsers.fullname}`;
    const phoneNumber = dataUsers.nomorTelp ? dataUsers.nomorTelp : 'No phone number provided';

    return (
        <div className="flex flex-col items-center p-4">
            <div className="flex flex-col items-center mt-10">
                <Image
                    src={dataUsers.imageUri ? dataUsers.imageUri : (dataUsers.fullname ? `https://ui-avatars.com/api/?name=${encodeURIComponent(dataUsers.fullname)}` : '')}
                    className="rounded-full mt-2 shadow-xl"
                    alt="Profile Picture"
                    width={110}
                    height={110}
                />
                <div className="flex flex-col items-center mt-4">
                    <h2 className="text-2xl font-bold text-[#DB461A]">{dataUsers.fullname}</h2>
                    <button
                        onClick={() =>
                            router.push({
                                pathname: '/updateProfile',
                                query: {
                                    userId: userId,
                                    fullname: dataUsers.fullname,
                                    imageUri: dataUsers.imageUri,
                                    nomorTelp: dataUsers.nomorTelp,
                                },
                            })
                        }
                        className="mt-3 bg-[#FFAC33] rounded-full px-6 py-2 text-white font-bold"
                        style={{ backgroundImage: 'linear-gradient(180deg, #EA7604 0%, #DC4919 100%)' }}
                    >
                        Edit Profile
                    </button>
                </div>
            </div>
            <div className="mt-10 w-4/5">
                <div className="flex items-center bg-white p-4 mt-4 rounded-md shadow-md">
                    <Image src="/Profile.svg" alt="Profile Icon" width={39} height={39} />
                    <p className="ml-4 text-lg font-bold text-[#004268]">{dataUsers.fullname}</p>
                </div>
                <div className="flex items-center bg-white p-4 mt-4 rounded-md shadow-md">
                    <Image src="/Email.svg" alt="Email Icon" width={39} height={39} />
                    <p className="ml-4 text-lg font-bold text-[#004268]">{dataUsers.email}</p>
                </div>
                <div className="flex items-center bg-white p-4 mt-4 rounded-md shadow-md">
                    <Image src="/Phone.svg" alt="Phone Icon" width={39} height={39} />
                    <p className="ml-4 text-lg font-bold text-[#004268]">{phoneNumber}</p>
                </div>
                <Link href={`/myCard?userId=${userId}`} passHref>
                    <div className="flex items-center bg-white p-4 mt-4 rounded-md shadow-md">
                        <Image src="/Card.svg" alt="Card Icon" width={39} height={39} />
                        <p className="ml-4 text-lg font-bold text-[#004268]">My Card</p>
                    </div>
                </Link>
                <button className="flex items-center bg-white p-4 mt-4 rounded-md shadow-md" onClick={handleLogout}>
                    <Image src="/Logout.svg" alt="Logout Icon" width={39} height={39} />
                    <p className="ml-4 text-lg font-bold text-[#004268]">Log Out</p>
                </button>
            </div>
        </div>
    );
};

export default Profile;
