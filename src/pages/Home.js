import { useEffect, useState } from "react"
import Pagination from 'react-bootstrap/Pagination';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export default function Home() {
    const [products, setProducts] = useState([])
    const [data, setData] = useState({"limit": 20, "skip": 0, "action": "get"})
    const [totalProducts, setTotalProducts] = useState(0)
    const [modalData, setModalData] = useState({"title": "Add new product", "action": "Add"})
    const [productName, setProductName] = useState("")
    const [productPrice, setProductPrice] = useState("")
    const [productDescription, setProductDescription] = useState("")
    const [productCategory, setProductCategory] = useState("")
    const [productBrand, setProductBrand] = useState("")
    const [currentId, setCurrentId] = useState(0)
    const [modalShow, setModalShow] = useState(false)
    const pagination = () => {
        let items = []
        let number = 1
        for (let index = 0; index < totalProducts; index += 20) {
            items.push(<Pagination.Item onClick={() => setData({"limit": 20, "skip": index, "action": "get"})} key={index} active={false}>{number}</Pagination.Item>)
            number ++
        }
        return items
    }
    useEffect(() => {
        const fetchData = async () => {
            const prod = await fetch("http://localhost:3005/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            const json = await prod.json()
            console.log(json)
            setProducts(json.products)
            setTotalProducts(json.total)
        }
        fetchData().catch(console.error)
        return 
    }, [data]);


    const handleDelete = async () => {
        const deleteProduct = await fetch("http://localhost:3005/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"action": "delete", "id": currentId})
        })
        const json = await deleteProduct.json()
        if(json.id === currentId) {
            alert("Successfully deleted")
            setModalShow(false)
        }else {
            alert("Error while deleting")
        }
        
    }

    const handleUpdate = async () => {
        const updateProduct = await fetch("http://localhost:3005/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "action": "update", 
                "id": currentId, 
                "title": productName,
                "price": productPrice,
                "description": productDescription,
                "category": productCategory,
                "brand": productBrand
            })
        })
        const json = await updateProduct.json()
        console.log(json)
        if(json.id === currentId) {
            alert("Successfully updated")
            const newProducts = products
            newProducts[currentId - 1] = json
            setProducts(newProducts)
            setModalShow(false)
        }else {
            alert("Error while deleting")
        }
    }

    return (
        <div>
            <center>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center"}}>
                    <h1>Products</h1>
                    <Button onClick={() => {
                        setProductBrand("")
                        setProductName("")
                        setProductDescription("")
                        setProductPrice("")
                        setProductCategory("")
                        setModalShow(true)
                        setModalData({"title": "Add new product", "action": "Add"})
                        setCurrentId()
                    }} style={{ position: "absolute", right: "10dvw", top: "10px"}} variant="primary">Add new product</Button>
                </div>
                <Table responsive striped bordered hover style={{width: "80dvw"}}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            products.map(product => {
                                return <tr onClick={(e) => {
                                    setProductBrand(product.brand)
                                    setProductName(product.title)
                                    setProductDescription(product.description)
                                    setProductPrice(product.price)
                                    setProductCategory(product.category)
                                    setModalShow(true)
                                    setModalData({"title": "Update product", "action": "Update"})
                                    setCurrentId(product.id)
                                }} key={product.id}>
                                        <td>{product.id}</td>
                                        <td>{product.title}</td>
                                        <td>{product.price}</td>
                                    </tr>
                            })
                        }
                    </tbody>
                </Table>
                <Pagination style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row"}}>{pagination()}</Pagination>
                <Modal show={modalShow}>
                    <Modal.Header closeButton>
                        <Modal.Title>{modalData.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form style={{ width: "100%", height: "100%", margin: "auto", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                        <Form.Group as={Row} className="mb-3" controlId="formBasicEmail" style={{ width: "100%"}}>
                            <Form.Label column sm="2">Name</Form.Label>
                            <Col sm="10">
                                <Form.Control type="text" value={productName} onChange={e => setProductName(e.target.value)}/>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" controlId="formPrice" style={{ width: "100%"}}>
                            <Form.Label column sm="2">Price</Form.Label>
                            <Col sm="10">
                                <Form.Control type="text" value={productPrice} onChange={e => setProductPrice(e.target.value)}/>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" controlId="formDescription" style={{ width: "100%"}}>
                            <Form.Label column sm="3">Description</Form.Label>
                            <Col sm="9">
                                <Form.Control as="textarea" type="text" value={productDescription} onChange={e => setProductDescription(e.target.value)}/>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" controlId="formCategory" style={{ width: "100%"}}>
                            <Form.Label column sm="2">Category</Form.Label>
                            <Col sm="10">
                                <Form.Control type="text" value={productCategory} onChange={e => setProductCategory(e.target.value)}/>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3" controlId="formBrand" style={{ width: "100%"}}>
                            <Form.Label column sm="2">Brand</Form.Label>
                            <Col sm="10">
                                <Form.Control type="text" value={productBrand} onChange={e => setProductBrand(e.target.value)}/>
                            </Col>
                        </Form.Group>
                    </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => setModalShow(false)} variant="secondary">Close</Button>
                        <Button variant="primary" onClick={handleUpdate}>{modalData.action}</Button>
                        {
                            modalData.action === "Update" && <Button onClick={handleDelete} variant="danger">Delete</Button>
                        }
                    </Modal.Footer>
                </Modal>
            </center>
        </div>
    )
}