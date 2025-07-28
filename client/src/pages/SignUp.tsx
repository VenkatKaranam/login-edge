import Form from "../components/Form.tsx";

const SignUp = () => {
    return (
        <div id={'signup'} className={'signup'}>
            <img className={'vector'} src='/vector.png' alt={'vector'}/>
            <Form mode={'signup'}/>
        </div>
    )
}
export default SignUp
