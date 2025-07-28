import {useEffect, useState} from "react";
import axios from "axios";
import logo from "../assets/logo.png";
import {Link} from "react-router-dom";

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
            <h2 className={'message'}>
                <div className="title"> You are logged in as </div>
                <div className="user-name">{user}</div>
                <Link className={'login'} to={'/login'}>Login with different Account</Link>
            </h2>
        </div>
    )
}
export default Profile
