import {useEffect, useState} from "react";
import axios from "axios";

const Profile = () => {
    const [user, setUser] = useState<string>('')

    const getLoggedInUserDetails = async () => {
        const {data} = await axios.get('/api/profile')
        if (data.success){
            setUser(data.userEmail)
        }
    }

    useEffect(()=>{
        ;(async() =>{
            await getLoggedInUserDetails()
        })()
    },[])

    return (
        <div id={'profile'} className={'profile'}>
            <h2 className={'message'}>You are logged in as {user}</h2>
        </div>
    )
}
export default Profile
