import Form from "../components/Form.tsx";
import vector from "../assets/vector.png"

const SignUp = () => {
    return (
        <div id={'signup'} className={'signup'}>
            <img className={'vector'} src={vector} alt={'vector'}/>
            <Form mode={'signup'}/>
        </div>
    )
}
export default SignUp
