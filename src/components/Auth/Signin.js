import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './Auth.css';
import { useAuth } from '../../App';
import Logo_img from '../../assets/signinLogo.png';
// import AnimatedPage from '../../AnimatedPage';
// import { logEvent } from 'firebase/analytics';

const Signin = () => {
    const [inputData, setInputData] = useState({
        email: { value: '', valid: false },
        password: { value: '', valid: false },
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { getUserData } = useAuth();

    useEffect(() => {
        if (navigator.userAgent.match(/samsung/i)) {
            alert("Estas usando Samsung Internet y es posible que tengas el modo oscuro activado.\nPorfavor, desactivalo desde las opciones de abajo a la derecha, gracias!");
        }
    }, []);

    const signinUser = (evt) => {
        evt.preventDefault();

        setLoading(true);
        document.body.style.overflow = 'hidden';
        
        signInWithEmailAndPassword(auth, inputData.email.value, inputData.password.value)
            .then(async () => {
                await getUserData();
                navigate('/');
                // logEvent(analytics, 'login');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                console.error(errorCode);
                alert(errorMessage);
            }).finally(() => {
                setLoading(false);
                document.body.style.overflow = 'auto';
            })
    }

    const checkValue = (evt) => {
        let value = evt.target.value;
        const targetName = evt.target.name;
        let isValid = false;

        switch (targetName) {
            case 'password': {
                // const regex = new RegExp('^[0-9]{6,6}$');
                // isValid = regex.test(value);
                if (value.split('').length > 5){
                    isValid = true;
                }
                break;
            }

            case 'email': {
                const regex = new RegExp('[^@]+@[^@]+\.[a-zA-Z]{2,6}');
                isValid = regex.test(value);
                break;
            }

            default: break;
        }

        if (isValid) {
            evt.target.classList.remove('registerForm_inputInvalid');
        }

        const newInputData = {
            ...inputData,
            [evt.target.name]: {
                value: value,
                valid: isValid
            }
        }

        if (Object.values(newInputData).every(({ valid }) => valid)) {
            const submitBtn = evt.target.form.lastChild;
            submitBtn.disabled = false;
        } else {
            const submitBtn = evt.target.form.lastChild;
            submitBtn.disabled = true;
        }

        setInputData(newInputData);
    }

    const loadPlaceHolderAnim = (evt) => {
        const parent = evt.target.labels[0];
        if (evt.target.value.length > 0 && !parent.classList.contains('registerForm_labelAnim')) {
            parent.classList.add('registerForm_labelAnim');
        } else if (evt.target.value.length === 0) {
            parent.classList.remove('registerForm_labelAnim');
        }
    }

    const loadBorderAnim = (evt) => {
        const container = evt.target.parentElement.parentElement;
        container.classList.add('fieldIsFocused');

        if (evt.target.classList.contains('registerForm_inputInvalid')) {
            const valid = inputData[evt.target.name].valid;
            if (valid) {
                evt.target.classList.remove('registerForm_inputInvalid');
            } else {
                evt.target.classList.add('registerForm_inputInvalid');
            }
        }
    }

    const deLoadBorderAnim = (evt) => {
        const container = evt.target.parentElement.parentElement;
        container.classList.remove('fieldIsFocused');

        if (!evt.target.classList.contains('registerForm_inputInvalid')) {
            const valid = inputData[evt.target.name].valid;
            if (valid) {
                evt.target.classList.remove('registerForm_inputInvalid');
            } else {
                evt.target.classList.add('registerForm_inputInvalid');
            }
        }
    }

    return (
        // <AnimatedPage>
            <div className='login_Container'>
                <div className='registerSubContainer'>
                    <img className='signinLogo' src={Logo_img} alt='logo'/>
                    <div className='registerFormContainer'>
                        <div className='formContainer' style={{width: '100%'}}>
                            <form className='registerForm' style={{margin: '0'}} onSubmit={signinUser}>
                                <h2 className='loginForm_title'>Inicia sesión</h2>

                                <div className='loginForm_fieldContainer'>
                                    <div className='registerForm_field'>
                                        <label className='registerForm_label'>
                                            <span className='registerForm_labelSpan'>Correo electronico</span>
                                            <input
                                                name='email'
                                                className='registerForm_input'
                                                type='email'
                                                autoComplete='email'
                                                autoCapitalize='off'
                                                pattern="[^@]+@[^@]+\.[a-zA-Z]{2,6}"
                                                required
                                                autoCorrect='off'
                                                onChange={(evt) => {
                                                    loadPlaceHolderAnim(evt);
                                                    checkValue(evt);
                                                }}
                                                onFocus={loadBorderAnim}
                                                onBlur={deLoadBorderAnim}
                                                value={inputData.email.value}
                                            />
                                        </label>
                                    </div>
                                </div>

                                <div className='loginForm_fieldContainer'>
                                    <div className='registerForm_field'>
                                        <label className='registerForm_label'>
                                            <span className='registerForm_labelSpan'>PIN</span>
                                            <input
                                                name='password'
                                                type='password'
                                                className='registerForm_input discTxtSecurity'
                                                autoCapitalize='off'
                                                required
                                                autoCorrect='off'
                                                autoComplete='new_password'
                                                onChange={(evt) => {
                                                    loadPlaceHolderAnim(evt);
                                                    checkValue(evt);
                                                }}
                                                onFocus={loadBorderAnim}
                                                onBlur={deLoadBorderAnim}
                                                value={inputData.password.value}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <button className='registerSubmitBtn' type='submit' disabled>Entrar</button>
                            </form>
                        </div>
                        <div className='redirectToSignInContainer' style={{width: '100%'}}>
                            <p className='redirectToSignIn'>
                                {"No tienes cuenta? "}
                                <Link className='redirectToSignIn_link' to='/register'>Registrarse</Link>
                            </p>
                        </div>
                    </div>
                    {
                        loading && (
                            <div className='register_loadingPanel'>
                                <div className='register_loadingCircle'></div>
                            </div>
                        )
                    }
                </div>
            </div>
        // </AnimatedPage>
    )
}

export default Signin;