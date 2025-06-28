// pages/NotePage.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation} from "react-router-dom";
import { supabase } from "../CreateClient";
import NoteTitle from "../components/NoteTitle";
import { IoIosArrowRoundBack } from "react-icons/io";
import SideBar from "../components/navbar";
import EditableText from "../components/editableText";
import EditableText2 from "../components/editableText2";
import { Button, Modal, Alert, Navbar } from "react-bootstrap";
import {Container} from "react-bootstrap";
import { NavDropdown } from "react-bootstrap";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../App.css';
import { Card , Col ,Row} from "react-bootstrap";
import { Form } from "react-bootstrap";
function NotePage() {

  const [note, setNote] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [calendarModal , setCalendarModal] = useState(false);
  const [successEdited, setSuccessEdited] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const message = location.state?.message;
  const [chooseDate , setChooseDate] = useState(null);
  const [reminderInput , setReminderInput] = useState(false);
  const [reminder_title , setReminderTitle] = useState("");
  const [reminder_desc , setReminderDesc] = useState("");
  const [notes , setNotes] = useState([]);
  const { id } = useParams();
  const localKey = `calendar_${id}`;




useEffect(()=>{
  
   const getNotes =async () =>{
    const {data , error} = await supabase.from("Notes").select('*');

    if(error){
      console.log("error fetching notes" , error);
      
    } else {
      setNotes(data);
    }
   }

   getNotes();
},[])


const handleSubmitReminder = async(e) =>{
  e.preventDefault();

  const NotesIdParsed = parseInt(id);

  const {data , error} = await supabase.from("Reminder").insert({
    reminder_title : reminder_title,
    reminder_desc :reminder_desc,
    reminder_date : chooseDate.toDateString(),
    note_id : NotesIdParsed,
    
  })

  if (error){
    console.log("error submitting reminder" , error.message);
    return;
  } else{
    console.log("Reminder created successfully!" , data);
    navigate(`/notes/${id}`);
    handleReminder(false);
  }
}




  const handleReminder = () =>{
    setReminderInput(true);
  }


  


  const handleDateChange = (date) =>{
    setChooseDate(date);
  };

//load visibility for the note from local storage //
   

  const getCalendarVisibility = () =>{
    const stored = localStorage.getItem(localKey);
    return stored == 'true';
  }
    const [calendar , setCalendar] = useState(getCalendarVisibility);


// update local storage whenever the update is changed //
  useEffect(()=>{
    localStorage.setItem(localKey, calendar);
    
  },[calendar,localKey]);

  const toggleCalendar = () =>{
    setCalendar(prev => !prev)
     setCalendarModal(true);
    
  }
 

  

  useEffect(() => {
    if (message) {
      setSuccessEdited(true);
    }
  }, [message]);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const { data, error } = await supabase
          .from("Notes")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setNote(data);
      } catch (err) {
        setFetchError(err.message);
      }
    };



    fetchNote();
  }, [id]);

  const handleTitleSave = async (newTitle) => {
    const { error } = await supabase.from("Notes").update({ note_title: newTitle }).eq("id", id);
    if (!error) {
      setNote((prev) => ({ ...prev, note_title: newTitle }));
    }
  };

  const handleDescSave = async (newDesc) => {
    const { error } = await supabase.from("Notes").update({ note_desc: newDesc }).eq("id", id);
    if (!error) {
      setNote((prev) => ({ ...prev, note_desc: newDesc }));
    }
  };

  const deleteNote = async () => {
    const { error } = await supabase.from("Notes").delete().eq("id", id);
    if (!error) {
      navigate("/home", { state: { message2: "Note deleted successfully" } });
    }
  };


  

  return (
    <div>
        
      <NoteTitle />

      {note && (
        <>
                 <Container>
        
            {message && successEdited && (
                
                <Alert variant="success" dismissible onClose={() => setSuccessEdited(false)}>
                <Alert.Heading>Updated!</Alert.Heading>
                <p>Your note has been updated!</p>
                </Alert>
            )}

                {calendar && calendarModal &&(
                <Alert variant="success" dismissible onClose={() => setCalendarModal(false)}>
                <Alert.Heading>New Component!</Alert.Heading>
                <p>Calendar is added!</p>
                </Alert>
                 )}
        
         
          <div
            className="p-5"
            style={{
              backgroundColor: "rgb(24, 22, 26)",
              height: "670px",
              fontFamily: "League Spartan",
            }}
          >
           

            
                <Navbar className="mb-5"  style={{backgroundColor: 'rgb(24, 22, 26)' }}>
        <Navbar.Brand className="text-white" href="#home"> <a href="/home">
              <IoIosArrowRoundBack className="text-white " style={{ fontSize: "20px" }} />
            </a></Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end" >
          <Navbar.Text className="text-white" >
            <NavDropdown title="..." id="basic-nav-dropdown" style={{backgroundColor: 'rgb(24, 22, 26)' , color:'white'}} >
              <NavDropdown.Item  onClick={toggleCalendar}  >Add Calendar</NavDropdown.Item>
            </NavDropdown>
          </Navbar.Text>
        </Navbar.Collapse>
    </Navbar>


            <EditableText initialText={note.note_title} onSave={handleTitleSave} />
            <div className="mt-5">
              <EditableText2 initialText2={note.note_desc} onSave={handleDescSave} />
             
            </div>

             
        

            {calendar && (
              <>
              <p style={{fontSize:'20px' ,textDecoration:'underline'}} className="mt-5 text-white">Calendar</p>
              <Row>
                <Col>
                <Calendar  onChange={handleDateChange} value={chooseDate}  /> 
          
        </Col>
             <Col>
           {chooseDate&&(
            <>
             <Card className="mt-2" >
            <Card.Body>
              <Card.Text>

                     <Navbar  >
        <Navbar.Toggle />
          <span></span><Navbar.Text >Selected date : {chooseDate.toDateString()} </Navbar.Text>
        <Navbar.Collapse className="justify-content-end" >
          <Navbar.Text className="text-white" >
            <NavDropdown title="..."  >
              <NavDropdown.Item onClick={handleReminder}>Add Reminder</NavDropdown.Item>
            </NavDropdown>
          </Navbar.Text>
        </Navbar.Collapse>
    </Navbar>

      {reminderInput&&(
         <Form onSubmit={handleSubmitReminder}>
          
              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Reminder Title</Form.Label>
        <Form.Control type="text" onChange={(e)=>setReminderTitle(e.target.value)} name="reminder_title" rows={3} />
      </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Reminder Description</Form.Label>
        <Form.Control as="textarea" onChange={(e)=>setReminderDesc(e.target.value)} name="reminder_desc" rows={3} />
      </Form.Group>
       <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Date</Form.Label>
        <Form.Control type="text" name="reminder_date"  rows={3} value={chooseDate.toDateString()} />
      </Form.Group>
      <Button type="submit">Submit</Button>
         </Form>
      )}

    
              </Card.Text>
            </Card.Body>
          </Card>
          
                  </>
              )}
          
        </Col>
        </Row>
        
             
              </>
              )}


             

                <div className="mt-5">
              <Button variant="danger" onClick={() => setShowModal(true)}>
                Delete
              </Button>
            </div>

          

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
              <Modal.Header style={{ backgroundColor: "rgb(24, 22, 26)" }}>
                <Modal.Title style={{ color: "white" }}>Are you sure?</Modal.Title>
              </Modal.Header>
              <Modal.Footer style={{ backgroundColor: "rgb(24, 22, 26)" }}>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={deleteNote}>
                  Proceed
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
     </Container>
          <SideBar />
          
        </>
      )}
    </div>
  );
}

export default NotePage;
