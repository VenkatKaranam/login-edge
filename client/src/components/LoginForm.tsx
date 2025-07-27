import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import axios from "axios";

type Field = {
    value: string
    error: string
}

type FormProps = {
    mode: 'login'| 'signup'
}

const LoginForm =({mode}:FormProps) => {
    const defaultFields:Field = {
        value:'',
        error: ''
    }
    const [email, setEmail] = useState<Field>(defaultFields)
    const [password, setPassword] = useState<Field>(defaultFields)
    const [serverError, setServerError] = useState<string>('')
    const navigate = useNavigate();

    const validatePassword:() => boolean = () =>{
        if (password.value.length <= 0){
            setPassword({...password, error : 'Password is required'})
            return false;
        }

        if (mode === 'signup' && (password.value.length > 15 || password.value.length < 6)) {
            setPassword({...password, error: 'Should contains max 6-15 characters'})
            return false
        }

        setPassword({...password, error: ''})
        return true
    }

    const validateEmail:() => boolean = () => {
        if (email.value.length <= 0) {
            setEmail({...email, error: 'Email is required'})
            return false
        }

        const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailReg.test(email.value)){
            setEmail({...email, error: 'Please enter a valid email'})
            return false
        }

        setEmail({...email, error: ''})
        return true
    }

    const handleSubmit = async (e:any) => {
        e.preventDefault()

        setServerError('')

        if (!validateEmail() || !validatePassword()) {
            return
        }

        try{
            const {data} = await axios.post(mode === 'login' ? '/api/login' : 'api/signup',
                {
                    email : email.value,
                    password: password.value
                },
            )

            if (!data.success) {
                setServerError(data.message)
                return
            }
            const redirectURL = mode === 'login' ? '/profile' : '/login';
            navigate(redirectURL)
        } catch (e) {
            console.log(e)
            setServerError("Something went wrong")
        }
    }

    return (
        <div id={'login-form-container'}>
            <div className={'greeting'}>
                <h2 className={'message'}>Welcome Back!</h2>
                <p className={'info'}>Please enter log in details below</p>
            </div>

            {Boolean(serverError) ? <div className={'server-error'}>{serverError}</div> :<></>}

            <form className={'form'} onSubmit={handleSubmit}>
                <div className={'inputs-group'}>
                    <div className={'input-container'}>
                        <input
                            type={'email'}
                            className={'input-mail'}
                            placeholder="Email"
                            value={email.value}
                            name='email'
                            onChange={(e)=> setEmail({value: e.target.value.trim().toLowerCase(), error: ''})}
                            onBlur={validateEmail}
                        />
                        {Boolean(email.error) ? <span className={'error'}>{email.error}</span> : ''}
                    </div>


                    <div className={'input-container'}>
                        <input
                            type={'password'}
                            className={'input-password'}
                            placeholder="Password"
                            value={password.value}
                            name='password'
                            onChange={(e)=>setPassword({value:e.target.value.trim(), error: ''})}
                            onBlur={validatePassword}
                        />
                        {Boolean(password.error) ? <span className={'error'}>{password.error}</span> : ''}
                    </div>
                </div>

                <button type={'submit'} className={'submit-button'}>
                    {mode === 'login' ? 'Sign in' : 'Sign up'}
                </button>

            </form>

            {/*<div className={'horizontal-line'}></div>*/}

            {mode === 'login'?
                <div className={'signup'}>
                    <span>
                        Don't have an account?
                        <Link className={'signup-link'} to='/signup'>Signup</Link>
                    </span>
                </div>
                :
                <div className={'login'}>
                    <span>
                        Already have an account?
                        <Link className={'login-link'} to='/login'>Login</Link>
                    </span>
                </div>
            }

        </div>

    )
}
export default LoginForm;