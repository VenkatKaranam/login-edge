import LoginForm from "../components/LoginForm.tsx";

const Login = () => {
    return (
        <div id={'login'} className={'login'}>
            <LoginForm/>
            <img className={'vector'} src='/vector.png' alt={'vector'}/>
        </div>
    )
}
export default Login
