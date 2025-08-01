import Form from "../components/Form.tsx";
import logo from "../assets/logo.png"
import vector from "../assets/vector.png"

const Login = () => {
    return (
        <div id={'login'} className={'login'}>
            <div className='logo'>
                <img src={logo} alt={'logo'}/>
                <span className='title'>LoginEdge</span>
            </div>
            <Form mode={'login'}/>
            <img className={'vector'} src={vector} alt={'vector'}/>
        </div>
    )
}
export default Login
