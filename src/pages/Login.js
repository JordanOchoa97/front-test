import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'


export default function Login () {
    const [user, setUser] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleSubmit = e => {
        let data = {
            username: user,
            password
        }
        console.log(data)
        e.preventDefault()
        fetch("http://localhost:3002/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(res => res.json()).then(res => {
            console.log(res)
            if(res.token !== undefined){
                console.log("You'll be redirected ot...");
                navigate('/home')
            }else {
                alert("Invalid credentials")
            }
        })
    }
    return (
        <Card style={{ width: '30dvw', height: "80dvh", backgroundColor: "#ccc", margin: "auto", borderRadius: "20px" , marginTop: "10dvh"}}>
            <Form onSubmit={handleSubmit} style={{ width: "80%", height: "100%", margin: "auto", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                <Form.Group className="mb-3" controlId="formBasicEmail" style={{ width: "100%"}}>
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter email" value={user} onChange={e => setUser(e.target.value)}/>
                    <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword" style={{ width: "100%"}}>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox" >
                    <Form.Check type="checkbox" label="Check me out" />
                </Form.Group>
                <Button variant="primary" type="submit" style={{ width: "80%"}}>
                    Submit
                </Button>
            </Form>
        </Card>
    )
}