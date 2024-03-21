import React, { useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import $ from "jquery";


function Httprequest() {

  // const [login, setLogin] = useState(true);
  // const [logout, setLogout] = useState(true);

  const [allData, setAllData] = useState([]);
  const [oneData, setOneData] = useState([]);
  const [counter, setCounter] = useState(1);
  const [animation, setAnimation] = useState("animate__animated animate__fadeInRight");
  const [showModal, setShowModal] = useState(false);
  const [index, setIndex] = useState(1);
  const [button, setButton] = useState(true);
  const [input, setInput] = useState({
    title: " ",
    body: " "
  })

  function ajaxRequest() {
    $.ajax({
      type: "GET",
      url: "http://localhost:1000",
      success: (res) => {
        // console.log(res);
        return (
          setAllData(res),
          setIndex(res[res.length - 1].id + 1)
          // console.log(index)
        )
      }
    })
  }

  function httpRequest() {
    $.ajax({
      type: 'GET',
      url: `http://localhost:1000/${counter}`,
      success: (response) => {
        //console.log(response);
        // setOneData(response);
        if (response.length == 0) {
          setOneData(
            [
              {
                title: "No Data",
                body: "There is no Data"
              }
            ]
          )
        }

        else {
          setOneData(response);
        }
      }
    })
  }

  useEffect(() => {
    // console.log(allData[allData.length-1].id)
    ajaxRequest();
    httpRequest();
  }, [counter])

  function prevFunction() {

    if (counter > 1) {
      setCounter(counter - 1);
    }
    setAnimation("animate_animated animate_fadeInLeft");

  }
  function nextFunction() {

    if (counter < allData.length - 1) {
      setCounter(counter + 1);
    }
    setAnimation("animate_animated animate_fadeInRight");

  }

  function Card({ item }) {
    return (
      <>
        <div className={`card my-3 shadow-sm ${animation}`} style={{ height: 120 }} >
          <div className="card-header fw-bold text-capitalize d-flex justify-content-between align-item-center">
            {item.title}
            <div>
              <Button className='btn btn-info me-2' onClick={() => editData(item)}><i className="fa fa-edit"></i></Button>
              <Button className='btn btn-danger' onClick={() => deleteData(item.id)}><i className="fa fa-trash"></i></Button>

            </div>
          </div>
          <div className="card-body ">
            {item.body}
          </div>
        </div>
      </>
    )
  }




  // useEffect(()=>{
  //   $("#myBtn").on("click",()=>{
  //     alert('ok');
  //   })
  // },[])

  function insertData(e) {
    e.preventDefault();
    let form = e.target;
    let formData = new FormData(form);
    // console.log(formData);
    // console.log(formData.get("title"));

    let title2 = formData.get("title");
    let body2 = formData.get("body");
    let id2 = index;

    // console.log(title2)
    // console.log(body2)
    // console.log(id2)

    $.ajax({
      type: 'POST',
      url: "http://localhost:1000",
      data: {
        id: id2,
        title: title2,
        body: body2
      },
      success: (response) => {
        // console.log(response);
        return (
          response,
          setShowModal(false),
          setCounter(response.data.id),
          setInput({
           title : " ",
           body : " "
          }),
          // setCounter(id+1)
          

        )
      }
    })

  }

  // delete data
  function deleteData(id) {
    // console.log(id);
    let cnf = window.confirm("Do you want to delete your data");
    if (cnf) {
      // alert("Data Deleted Sucessfully")
      $.ajax(
        {
          type: 'DELETE',
          url: `http://localhost:1000/${id}`,
          success: (response) => {
            // console.log(response)
            let temp;
            if (allData.length > id) {
              temp = id + 1;
            }
            else if (allData.length < id) {
              temp = id - 1;
            }

            return
            (
              response,
              setCounter(temp)

            )
          }
        }
      )
    }
    else {
      window.alert("Your Data is Safe")
    }
  }
  //Edit Data
  function editData(item) {
    // console.log(item);
    return (
      setShowModal(true),
      setButton(false),
      setInput(item)
    )
  }
  //Update Data
  function updateData(e) {
    e.preventDefault();
    let formData = new FormData(e.target);
    $.ajax(
      {
        type : "PUT",
        url : `http://localhost:1000/${counter}`,
        data : formData,
        processData : false,
        contentType : false,
        success : (res)=>{
          console.log(res)
        } 
      }
    )
    return (
      // alert("OK"),
        
      setShowModal(false)
    

    )
  }

  //input field value
  function setInputValue(e) {
    e.preventDefault();
    // console.log("Ok");
    let input = e.target;
    let value = input.value;
    // console.log(value);
    let key = input.name;
    return setInput((old)=>
    {
      return{
        ...old,
        [key] : value
      }
    })
  }

  return (
    <>
      <div className="container rounded mt-2 bg-primary bg-opacity-25 
      rounded py-2 px-5 pb-5 shadow-sm overflow-hidden">
        <h1 className='text-center'>Http Request</h1>
        {/* <Button className='btn btn-primary me-2' onClick={()=>{setLogin(!login)}}>Login</Button> */}
        {/* <Button className='btn btn-danger' onClick={()=>{setLogout(!logout)}}>Logout</Button> */}
        {/* <h1 className='text-center'>Use Effect</h1>
    <Button id="myBtn">Click Me</Button>
    */}

        {/* {
      JSON.stringify(allData)
    } */}

        <div className='d-flex justify-content-between align-items-center'>
          <div className='display-4 fw-bold me-5'>Comments <sup>{allData.length ? counter : null}</sup></div>
          <Button
            className='fs-4 shadow-sm bg-secondary bg-opacity-25 rounded px-2 me-5'
            onClick={() => (setShowModal(true), setButton(true),setInput({
              title : " ",
              body : " "
            }))}>
            New Comments <sup>{allData.length ? allData.length : null}</sup>
          </Button>
        </div>
        {
          // allData.map((item, index) => 
          oneData.map((item, index) => {
            return <Card item={item} key={index} />
          })
        }

        <div className='float-end'>
          <Button className='me-2' onClick={prevFunction}>
            <i className="fa fa-angle-left"></i>

          </Button>
          <Button onClick={nextFunction}>
            <i className="fa fa-angle-right"></i>
          </Button>
        </div>
        <Modal show={showModal} onHide={() => { setShowModal(false) }}>
          <Modal.Header closeButton>
            <Modal.Title>
              Add New Comment
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={button ? insertData : updateData}>
              <Form.Group className='mb-3'>
                <Form.Label>
                  Title
                </Form.Label>
                <Form.Control type='text' name="title" value={input.title} onChange={setInputValue} />
              </Form.Group>
              <Form.Group className='mb-3'>
                <Form.Label>
                  Body
                </Form.Label>
                <textarea name="body" className='form-control' value={input.body} onChange={setInputValue}></textarea>
              </Form.Group>
              {
                button ? <Button type='submit' className='float-end'>Submit</Button> :
                  <Button type='submit' className='float-end bg-info'>Update</Button>

              }

            </Form>

          </Modal.Body>
        </Modal>
      </div>
    </>
  )
}

export default Httprequest;
