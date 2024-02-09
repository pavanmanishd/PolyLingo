import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import constants from "../config";

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(name, email, password);
        axios.post(`${constants.API_URL}/register`, {
            name: name,
            email: email,
            password: password,
        }).then((res) => {
            console.log(res);
            localStorage.setItem('user_id', res.data.user_id);
            localStorage.setItem('isLoggedIn', true);
            navigate('/');
        }).catch((err) => {
            localStorage.setItem('isLoggedIn', false);
            localStorage.setItem('user_id', '');
            console.log(err);
        });
    }

    return (
        <div>
            <h1>Register</h1>
            <form>
                <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" onClick={handleSubmit}>Register</button>
            </form>
        </div>
    )
}

export default Register;