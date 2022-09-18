import React, { useState, useEffect } from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState(0);
  const [username, setUsername] = useState("");

  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = (id) => {
    setEditId(id);
    setShowEdit(true);
  }

  const handleClose = (username) => {
    if (username == "") { return; }
    localStorage.setItem("username", input);
    setUsername(username);
    setShow(false)
  };

  useEffect(() => {
    fetch("https://6324660e5c1b435727a7901a.mockapi.io/todos")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
    var username = localStorage.getItem("username");
    if (username == null) {
      setShow(true);
    }
    else {
      setUsername(username);
      setShow(false);
    }
  }, [response, username])

  const addTodo = (content) => {
    if (content.length < 3){
      window.alert("Input length can not be less than 3!");
      return;
    }
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ content: content, isCompleted: false })
    }
    fetch('https://6324660e5c1b435727a7901a.mockapi.io/todos', requestOptions)
      .then(response => setResponse(response.json()))
  }

  const editTodo = (id, content) => {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ content: content })
    }
    fetch('https://6324660e5c1b435727a7901a.mockapi.io/todos/' + id, requestOptions)
      .then(response => setResponse(response.json()))
  }

  const deleteTodo = (id) => {
    fetch('https://6324660e5c1b435727a7901a.mockapi.io/todos/' + id, { method: "DELETE" })
      .then(response => setResponse(response.json()))
  }

  return (
    <div className="wrapper">
      <div className="container">
        <h2>Todo App</h2>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Welcome {username}</Form.Label>
            <Form.Control type="text" placeholder="Add new todo" onChange={(e) => { setInput(e.target.value); }} />
          </Form.Group>
          <Button variant="primary float-end mb-3" onClick={() => { addTodo(input); }}>
            Submit
          </Button>
        </Form>
        {
          items.map((item, index) => (
            <ListGroup style={{"width":"100%"}} key={index} className="mb-2">
              <ListGroup.Item variant="light" className="p-3" style={{"lineHeight": "38px"}}>
                {item.content}
                <Button variant="outline-danger float-end ms-2" onClick={() => { deleteTodo(item.id); }} type="submit">X</Button>
                <Button variant="outline-success float-end" onClick={() => { handleShowEdit(item.id, ); }} type="submit">✓</Button>
              </ListGroup.Item>
            </ListGroup>
          ))
        }
      </div>
      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Todo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Todo</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => { setInput(e.target.value); }}
                autoFocus
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEdit}>
            Close
          </Button>
          <Button variant="primary" onClick={() => { editTodo(editId, input);handleCloseEdit(); }}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={show} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Username</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Set Username</Form.Label>
              <Form.Control
                type="text"
                onChange={(e) => { setInput(e.target.value); }}
                autoFocus
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => { handleClose(input); }}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
