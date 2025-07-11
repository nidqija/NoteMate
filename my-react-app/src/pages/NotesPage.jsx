// pages/NotePage.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { supabase } from "../CreateClient";
import NoteTitle from "../components/NoteTitle";
import { IoIosArrowRoundBack } from "react-icons/io";
import SideBar from "../components/navbar";
import EditableText from "../components/editableText";
import EditableText2 from "../components/editableText2";
import { Button, Modal, Alert, Navbar, Container, NavDropdown, Card, Col, Row, Form } from "react-bootstrap";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../App.css';
import { HiMenuAlt3 } from "react-icons/hi";

function NotePage() {

  const [note, setNote] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [calendarModal, setCalendarModal] = useState(false);
  const [successEdited, setSuccessEdited] = useState(false);
  const [chooseDate, setChooseDate] = useState(null);
  const [reminderInput, setReminderInput] = useState(false);
  const [reminder_title, setReminderTitle] = useState("");
  const [reminder_desc, setReminderDesc] = useState("");
  const [notes, setNotes] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [createReminder, setCreateReminder] = useState(false);
  const [delReminder, setDeleteReminder] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;
  const localKey = `calendar_${id}`;

  // Fetch single note
  useEffect(() => {
    const fetchNote = async () => {
      const { data, error } = await supabase.from("Notes").select("*").eq("id", id).single();
      if (error) setFetchError(error.message);
      else setNote(data);
    };
    fetchNote();
  }, [id]);

  // Fetch reminders for this note
  const fetchReminders = async () => {
    const { data, error } = await supabase.from("Reminder").select("*").eq("note_id", id);
    if (error) console.log("error fetching reminders", error.message);
    else setReminders(data);
  };

  useEffect(() => {
    if (id) fetchReminders();
  }, [id, createReminder, delReminder]);

  // Fetch all notes (if needed for sidebar etc)
  useEffect(() => {
    const getNotes = async () => {
      const { data, error } = await supabase.from("Notes").select("*");
      if (error) console.log("error fetching notes", error);
      else setNotes(data);
    };
    getNotes();
  }, []);

  const handleSubmitReminder = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("Reminder").insert({
      reminder_title,
      reminder_desc,
      reminder_date: chooseDate.toDateString(),
      note_id: parseInt(id),
    });
    if (error) {
      console.log("error submitting reminder", error.message);
      return;
    }
    console.log("Reminder created successfully!");
    setReminderDesc("");
    setReminderTitle("");
    handleReminder(false);
    setCreateReminder(true);
  };

  const deleteReminder = async (reminderID) => {
    const { error } = await supabase.from("Reminder").delete().eq("reminder_id", reminderID);
    if (error) console.log("error deleting reminder", error.message);
    else {
      console.log("reminder deleted successfully!");
      setDeleteReminder(true);
    }
  };

  const handleReminder = (status) => setReminderInput(status);
  const handleDateChange = (date) => setChooseDate(date);
  const toggleCalendar = () => { setCalendar(prev => !prev); setCalendarModal(true); };

  // Load calendar visibility from local storage
  const getCalendarVisibility = () => localStorage.getItem(localKey) === 'true';
  const [calendar, setCalendar] = useState(getCalendarVisibility);

  useEffect(() => {
    localStorage.setItem(localKey, calendar);
  }, [calendar, localKey]);

  useEffect(() => {
    if (message) setSuccessEdited(true);
  }, [message]);

  const handleTitleSave = async (newTitle) => {
    const { error } = await supabase.from("Notes").update({ note_title: newTitle }).eq("id", id);
    if (!error) setNote(prev => ({ ...prev, note_title: newTitle }));
  };

  const handleDescSave = async (newDesc) => {
    const { error } = await supabase.from("Notes").update({ note_desc: newDesc }).eq("id", id);
    if (!error) setNote(prev => ({ ...prev, note_desc: newDesc }));
  };

  const deleteNote = async () => {
    const { error } = await supabase.from("Notes").delete().eq("id", id);
    if (!error) navigate("/home", { state: { message2: "Note deleted successfully" } });
  };

  // Calendar tile coloring based on reminders
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const hasReminder = reminders.some(r => new Date(r.reminder_date).toDateString() === date.toDateString());
      if (hasReminder) return <div style={{ backgroundColor: 'rgba(48, 44, 52, 1)', borderRadius: '50%', width: '10px', height: '10px', margin: 'auto' }}></div>;
    }
    return null;
  };

  return (
    <div>
      <NoteTitle />
      {note && (
        <Container>
          {message && successEdited && (
            <Alert variant="success" dismissible onClose={() => setSuccessEdited(false)}>
              <Alert.Heading>Updated!</Alert.Heading><p>Your note has been updated!</p>
            </Alert>
          )}
          {calendar && calendarModal && (
            <Alert variant="success" dismissible onClose={() => setCalendarModal(false)}>
              <Alert.Heading>New Component!</Alert.Heading><p>Calendar is added!</p>
            </Alert>
          )}
          {createReminder && (
            <Alert variant="success" dismissible onClose={() => setCreateReminder(false)}>
              <Alert.Heading>Added!</Alert.Heading><p>Your reminder has been added!</p>
            </Alert>
          )}
          {delReminder && (
            <Alert variant="danger" dismissible onClose={() => setDeleteReminder(false)}>
              <Alert.Heading>Deleted!</Alert.Heading><p>Your reminder has been deleted!</p>
            </Alert>
          )}

          <div className="p-5" style={{ backgroundColor: "rgb(24, 22, 26)", fontFamily: "League Spartan" }}>
            <Navbar className="mb-5" style={{ backgroundColor: 'rgb(24, 22, 26)' }}>
              <Navbar.Brand className="text-white" href="/home">
                <IoIosArrowRoundBack className="text-white" style={{ fontSize: "20px" }} />
              </Navbar.Brand>
              <Navbar.Toggle />
              <Navbar.Collapse className="justify-content-end">
                <NavDropdown title="..." style={{ backgroundColor: 'rgb(24, 22, 26)', color: 'white' }}>
                  <NavDropdown.Item onClick={toggleCalendar}>Add Calendar</NavDropdown.Item>
                  <NavDropdown.Item style={{ backgroundColor: 'red', color: 'white' }} onClick={() => setShowModal(true)}>Delete Note</NavDropdown.Item>
                </NavDropdown>
              </Navbar.Collapse>
            </Navbar>

            <h5 className="text-white mb-4" style={{ textDecoration: 'underline' }}>Main Note</h5>
            <EditableText initialText={note.note_title} onSave={handleTitleSave} />
            <div className="mt-5"><EditableText2 initialText2={note.note_desc} onSave={handleDescSave} /></div>

            {calendar && (
              <>
                <hr className="mt-5" style={{ borderTop: "1px solid #ccc" }} />
                <p style={{ fontSize: '20px', textDecoration: 'underline' }} className="text-white">Calendar</p>
                <Row>
                  <Col>
                    <Calendar onChange={handleDateChange} value={chooseDate} tileContent={tileContent} />
                  </Col>
                  <Col>
                    {chooseDate && (
                      <Card className="mt-2">
                        <Card.Body>
                          <Navbar>
                            <Navbar.Toggle />
                            <Navbar.Text>Selected date : {chooseDate.toDateString()}</Navbar.Text>
                            <Navbar.Collapse className="justify-content-end">
                              <NavDropdown className="text-dark" title="...">
                                <NavDropdown.Item onClick={() => handleReminder(true)}>Add Reminder</NavDropdown.Item>
                              </NavDropdown>
                            </Navbar.Collapse>
                          </Navbar>
                          {reminderInput && (
                            <Form onSubmit={handleSubmitReminder}>
                              <Form.Group className="mb-3">
                                <Form.Label>Reminder Title</Form.Label>
                                <Form.Control type="text" onChange={(e) => setReminderTitle(e.target.value)} />
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label>Reminder Description</Form.Label>
                                <Form.Control as="textarea" onChange={(e) => setReminderDesc(e.target.value)} />
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label>Date</Form.Label>
                                <Form.Control type="text" value={chooseDate.toDateString()} readOnly />
                              </Form.Group>
                              <Button type="submit">Submit</Button>
                            </Form>
                          )}
                        </Card.Body>
                      </Card>
                    )}
                  </Col>
                </Row>
              </>
            )}

            <h5 className="mb-3 mt-5 text-white">Your Reminders</h5>
            <Row xs={4} md={4}>
              {reminders.length > 0 ? reminders.map(reminder => (
                <Col key={reminder.reminder_id}>
                  <Card className="mb-5" style={{ width: "18rem" }}>
                    <Card.Body>
                      <Row className="justify-content-end">
                        <Col xs="auto">
                          <NavDropdown title={<HiMenuAlt3 />} className="text-dark">
                            <NavDropdown.Item>Edit Reminder</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => deleteReminder(reminder.reminder_id)} style={{ backgroundColor: "red", color: "white" }}>
                              Delete Reminder
                            </NavDropdown.Item>
                          </NavDropdown>
                        </Col>
                      </Row>
                      <p className="text-dark">Date: {reminder.reminder_date}</p>
                      <p>Event Name: {reminder.reminder_title}</p>
                      <p>Details: {reminder.reminder_desc}</p>
                    </Card.Body>
                  </Card>
                </Col>
              )) : <p className="text-white">There are no reminders for now.</p>}
            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
              <Modal.Header style={{ backgroundColor: "rgb(24, 22, 26)" }}>
                <Modal.Title style={{ color: "white" }}>Are you sure?</Modal.Title>
              </Modal.Header>
              <Modal.Footer style={{ backgroundColor: "rgb(24, 22, 26)" }}>
                <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button variant="danger" onClick={deleteNote}>Proceed</Button>
              </Modal.Footer>
            </Modal>

          </div>
        </Container>
      )}
      <SideBar />
    </div>
  );
}

export default NotePage;
