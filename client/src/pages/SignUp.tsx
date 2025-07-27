import LoginForm from "../components/LoginForm.tsx";

const SignUp = () => {
    return (
        <div id={'login'} className={'login'}>
            <img className={'vector'} src='/vector.png' alt={'vector'}/>
            <LoginForm mode={'signup'}/>
        </div>
    )
}
export default SignUp
