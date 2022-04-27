import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Logo_img from '../../assets/signinLogo.png';
import './Auth.css';

// import AnimatedPage from '../../AnimatedPage';
import { useAuth } from '../../App';
// import { logEvent } from 'firebase/analytics';

const Register = () => {
    const registerFormRef = useRef();
    const [inputData, setInputData] = useState({
        name: { value: '', valid: false },
        surname: { value: '', valid: false },
        adress: { value: '', valid: false },
        email: { value: '', valid: false },
        dni: { value: '', valid: false },
        phone: { value: '', valid: false },
        birth: { value: '', valid: false },
        sex: { value: '', valid: false },
        password: { value: '', valid: false },
        confirmPassword: { value: '', valid: false }
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { getUserData } = useAuth();

    const registerUser = (evt) => {
        evt.preventDefault();

        setLoading(true);
        document.body.style.overflow = 'hidden';

        createUserWithEmailAndPassword(auth, inputData.email.value, inputData.password.value)
            .then(async userCredential => {
                const user = userCredential.user;
                // const storagePhotoRef = ref(storage, `${inputData.email.value}/${inputData.name.value}_${new Date().toLocaleString().replaceAll('/', '-')}`);
                // const PhotoSnapshot = await uploadString(storagePhotoRef, inputData.photoURL.value, 'data_url');
                // const imgPhotoUrl = await getDownloadURL(PhotoSnapshot.ref);

                // const storageSignRef = ref(storage, `${inputData.email.value}/${inputData.name.value}_Signature_${new Date().toLocaleString().replaceAll('/', '-')}`);
                // const SignSnapshot = await uploadString(storageSignRef, inputData.signURL.value, 'data_url');
                // const imgSignUrl = await getDownloadURL(SignSnapshot.ref);
                await setDoc(doc(db, 'users', user.uid), {
                    name: inputData.name.value,
                    surname: inputData.surname.value,
                    dni: inputData.dni.value,
                    phone: inputData.phone.value,
                    birth: inputData.birth.value,
                    sex: inputData.sex.value,
                    adress: inputData.adress.value
                });

                await getUserData();
                // logEvent(analytics, 'sign_up');
                navigate('/');
            }).catch(error => {
                const errorCode = error.code;
                const errorMessage = error.message;

                console.error(errorCode);
                alert(errorMessage);
            }).finally(() => {
                setLoading(false);
                document.body.style.overflow = 'auto';
            })
    }

    const checkValue = async (evt) => {
        let value = evt.target.value;
        const targetName = evt.target.name;
        let isValid = false;

        const newInputData = { ...inputData }

        switch (targetName) {
            case 'confirmPassword': {
                // if (value.split('').length > 6) {
                //     value = inputData[evt.target.name].value;
                // }
                isValid = inputData.password.value === value;
                break;
            }

            case 'adress': {
                const valueArr = value.split(' ')?.map(val => {
                    const tempArr = val.toUpperCase().split('');
                    tempArr[0] = tempArr[0]?.toUpperCase();
                    return tempArr.join('');
                });
                value = valueArr?.join(' ');

                // const regex = new RegExp('^[A-Z].[a-zA-Z]*');
                // isValid = regex.test(value);
                isValid = Boolean(value);
                break;
            }

            case 'password': {
                // if (value.split('').length > 6) {
                //     value = inputData[evt.target.name].value
                // }
                // const regex = new RegExp('^[0-9]{6,6}$');
                // isValid = regex.test(value);
                if (value.split('').length > 5){
                    isValid = true;
                }

                if (!isValid || value !== newInputData['confirmPassword'].value) {
                    newInputData['confirmPassword'].valid = false;
                } else if (value === newInputData['confirmPassword'].value) {
                    newInputData['confirmPassword'].valid = true;
                }
                break;
            }

            case 'name': {
                const valueArr = value.split(' ')?.map(val => {
                    const tempArr = val.split('');
                    tempArr[0] = tempArr[0]?.toUpperCase();
                    return tempArr.join('');
                });
                value = valueArr?.join(' ');

                const regex = new RegExp('^[A-Z].[a-zA-Z]*');
                isValid = regex.test(value);
                break;
            }

            case 'surname': {
                const valueArr = value.split(' ')?.map(val => {
                    const tempArr = val.split('');
                    tempArr[0] = tempArr[0]?.toUpperCase();
                    return tempArr.join('');
                });
                value = valueArr?.join(' ');

                const regex = new RegExp('^[A-Z].[a-zA-Z]*');
                isValid = regex.test(value);
                break;
            }

            case 'dni': {
                value = value.split('').slice(0, 8).join('');
                const regex = new RegExp('^[0-9]{8,8}$');
                isValid = regex.test(value);
                break;
            }

            case 'email': {
                const regex = new RegExp('[^@]+@[^@]+\.[a-zA-Z]{2,6}');
                isValid = regex.test(value);
                break;
            }

            case 'phone': {
                const regex = new RegExp('^[+0-9].[0-9]*');
                isValid = regex.test(value);
                break;
            }

            case 'birth': {
                value = formatBirthDate(value);
                const regex = new RegExp('^[0-9/ -]+$')
                isValid = regex.test(value);
                if (!isValid && value !== '') {
                    value = inputData[evt.target.name].value
                }
                break;
            }

            case 'sex': {
                isValid = Boolean(value);
                break;
            }

            default: break;
        }

        if (isValid) {
            evt.target?.classList?.remove('registerForm_inputInvalid');
        }

        newInputData[evt.target.name] = {
            value: value,
            valid: isValid
        }


        if (Object.values(newInputData).every(({ valid }) => valid)) {
            const submitBtn = registerFormRef.current.lastChild;
            submitBtn.disabled = false;
        } else {
            const submitBtn = registerFormRef.current.lastChild;
            submitBtn.disabled = true;
        }

        setInputData(newInputData);
    }

    const formatBirthDate = (date) => {
        if (!date) return ''
        var newDate = date.replace('-', '/').replace('.', '/').replace('_', '/');

        return newDate;
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

    const loadPlaceHolderAnim = (evt) => {
        const parent = evt.target.labels[0];
        if (evt.target.value.length > 0 && !parent.classList.contains('registerForm_labelAnim')) {
            parent.classList.add('registerForm_labelAnim');
        } else if (evt.target.value.length === 0) {
            parent.classList.remove('registerForm_labelAnim');
        }
    }

    return (
        <div className='Register2_container'>
        <div className='Register2_headerDNIContainer'>
            <header className='Register2_header'>
                <h1 className='Register2_headerTitle'>Registro</h1>
            </header>
        </div>
        <img className='registerLogo' src={Logo_img} alt='logo'/>
        <form className='registerForm' onSubmit={registerUser} ref={registerFormRef}>
            <h2 className='registerForm_title'>Completa los datos para registrarte</h2>

            <div className='registerForm_fieldContainer'>
                <div className='registerForm_field'>
                    <label className='registerForm_label'>
                        <span className='registerForm_labelSpan'>Nombre</span>
                        <input
                            name='name'
                            className='registerForm_input'
                            type='text'
                            autoCapitalize='words'
                            required
                            autoCorrect='false'
                            autoComplete='name'
                            onChange={(evt) => {
                                loadPlaceHolderAnim(evt);
                                checkValue(evt);
                            }}
                            onFocus={loadBorderAnim}
                            onBlur={deLoadBorderAnim}
                            value={inputData.name.value}
                        />
                    </label>
                </div>
            </div>

            <div className='registerForm_fieldContainer'>
                <div className='registerForm_field'>
                    <label className='registerForm_label'>
                        <span className='registerForm_labelSpan'>Apellido</span>
                        <input
                            name='surname'
                            className='registerForm_input'
                            type='text'
                            autoComplete='surname'
                            autoCapitalize='words'
                            required
                            autoCorrect='off'
                            onChange={(evt) => {
                                loadPlaceHolderAnim(evt);
                                checkValue(evt);
                            }}
                            onFocus={loadBorderAnim}
                            onBlur={deLoadBorderAnim}
                            value={inputData.surname.value}
                        />
                    </label>
                </div>
            </div>

            <div className='registerForm_fieldContainer'>
                <div className='registerForm_field'>
                    <label className='registerForm_label'>
                        <span className='registerForm_labelSpan'>Domicilio</span>
                        <input
                            name='adress'
                            className='registerForm_input'
                            type='text'
                            autoCapitalize='characters'
                            required
                            autoCorrect='off'
                            onChange={(evt) => {
                                loadPlaceHolderAnim(evt);
                                checkValue(evt);
                            }}
                            onFocus={loadBorderAnim}
                            onBlur={deLoadBorderAnim}
                            value={inputData.adress.value}
                        />
                    </label>
                </div>
            </div>

            <div className='registerForm_fieldContainer'>
                <div className='registerForm_field'>
                    <label className='registerForm_label'>
                        <span className='registerForm_labelSpan'>DNI</span>
                        <input
                            name='dni'
                            className='registerForm_input'
                            type='number'
                            required
                            autoCorrect='false'
                            autoComplete='dni'
                            pattern="^[0-9]{8,8}$"
                            onChange={(evt) => {
                                loadPlaceHolderAnim(evt);
                                checkValue(evt);
                            }}
                            onFocus={loadBorderAnim}
                            onBlur={deLoadBorderAnim}
                            value={inputData.dni.value}
                        />
                    </label>
                </div>
            </div>

            <div className='registerForm_fieldContainer'>
                <span className='registerForm_checkboxTitle'>Sexo</span>
                <div className='registerForm_checkboxField' style={{ marginBottom: 3 }}>
                    <input
                        type='radio'
                        name='sex'
                        className='registerForm_checkboxInput'
                        value='Masculino'
                        onChange={checkValue}
                    />
                    <label className='registerForm_checkboxLabel'>Masculino</label>
                </div>
                <div className='registerForm_checkboxField'>
                    <input
                        type='radio'
                        name='sex'
                        className='registerForm_checkboxInput'
                        value='Femenino'
                        onChange={checkValue}
                    />
                    <label className='registerForm_checkboxLabel'>Femenino</label>
                </div>
            </div>

            <div className='registerForm_fieldContainer'>
                <div className='registerForm_field'>
                    <label className='registerForm_label'>
                        <span className='registerForm_labelSpan'>{"Nacimiento (MES/DÍA/AÑO)"}</span>
                        <input
                            name='birth'
                            className='registerForm_input'
                            type='text'
                            autoCapitalize='off'
                            pattern='^[0-9/ -]+$'
                            required
                            autoCorrect='off'
                            onChange={(evt) => {
                                loadPlaceHolderAnim(evt);
                                checkValue(evt);
                            }}
                            onFocus={loadBorderAnim}
                            onBlur={deLoadBorderAnim}
                            value={inputData.birth.value}
                        />
                    </label>
                </div>
            </div>

            <div className='registerForm_fieldContainer'>
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

            <div className='registerForm_fieldContainer'>
                <div className='registerForm_field'>
                    <label className='registerForm_label'>
                        <span className='registerForm_labelSpan'>Telefono</span>
                        <input
                            name='phone'
                            className='registerForm_input'
                            type='tel'
                            autoComplete='tel'
                            autoCapitalize='off'
                            pattern='^[+0-9].[0-9]*'
                            required
                            autoCorrect='off'
                            onChange={(evt) => {
                                loadPlaceHolderAnim(evt);
                                checkValue(evt);
                            }}
                            onFocus={loadBorderAnim}
                            onBlur={deLoadBorderAnim}
                            value={inputData.phone.value}
                        />
                    </label>
                </div>
            </div>

            {/* <div className='registerForm_fieldContainer'>
                <div className='registerForm_field'>
                    <label className='registerForm_label'>
                        <span className='registerForm_labelSpan'>Foto</span>
                        <div className='registerForm_input'>
                            <input
                                type='file'
                                accept='image/*'
                                className='registerForm_input'
                                style={{ visibility: 'hidden' }}
                                onChange={(evt) => {
                                    const file = evt.target.files[0];
                                    const reader = new FileReader();
                                    reader.onload = function () {
                                        const base64String = reader.result.replace('data:', '').replace(/^.+,/, '');
                                        removeBG(base64String);
                                    }

                                    reader.readAsDataURL(file);
                                }}
                            />
                        </div>
                    </label>
                </div>
            </div> */}

            <div className='registerForm_fieldContainer'>
                <div className='registerForm_field'>
                    <label className='registerForm_label'>
                        <span className='registerForm_labelSpan'>{'Contraseña'}</span>
                        <input
                            name='password'
                            className='registerForm_input discTxtSecurity'
                            type='password'
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

            <div className='registerForm_fieldContainer'>
                <div className='registerForm_field'>
                    <label className='registerForm_label'>
                        <span className='registerForm_labelSpan'>Confirmar contraseña</span>
                        <input
                            name='confirmPassword'
                            className='registerForm_input discTxtSecurity'
                            type='password'
                            autoCapitalize='off'
                            required
                            autoCorrect='off'
                            autoComplete='off'
                            onChange={(evt) => {
                                loadPlaceHolderAnim(evt);
                                checkValue(evt);
                            }}
                            onFocus={loadBorderAnim}
                            onBlur={deLoadBorderAnim}
                            value={inputData.confirmPassword.value}
                        />
                    </label>
                </div>
            </div>
            <button className='registerSubmitBtn' type='submit' disabled>Registrarse</button>
            <div className='redirectToSignInContainer' style={{width: '100%', marginTop: '30px'}}>
                <p className='redirectToSignIn'>
                    {"Ya tienes cuenta? "}
                    <Link className='redirectToSignIn_link' to='/signin'>Entrar</Link>
                </p>
            </div>
        </form>
        {
            loading && (
                <div className='register_loadingPanel'>
                    <div className='register_loadingCircle'></div>
                </div>
            )
        }
    </div>
    )
}

export default Register;