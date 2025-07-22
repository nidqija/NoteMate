import Cards1 from "./cards1";
import { Col, Container, Row, Alert } from "react-bootstrap";
import { supabase } from "../CreateClient";
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Loading from "../assets/loading";

function ChunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

function Header() {
  const [notes, setNotes] = useState([]);
  const [fetchError, setFetchErrors] = useState(null);
  const location = useLocation();
  const message = location.state?.message;
  const message2 = location.state?.message2;
  const [alerts, setAlerts] = useState(false);
  const [deleteAlerts , setDeleteAlerts] = useState(false);
  const [loading , setLoading] = useState(true); // add loading state


  const closeAlerts = () => setAlerts(false);
  const closeDeleteAlerts = () => setDeleteAlerts(false);


  

  useEffect(() => {
    if (message) {
      setAlerts(true);
    }
  }, [message]);

  useEffect(()=>{
     if (message2){
      setDeleteAlerts(true);
    }
  },[message2]);

  useEffect(() => {
    const fetchNotes = async () => {
      const { data, error } = await supabase.from("Notes").select();
        setLoading(false);

      if (error) {
        setFetchErrors("Could not fetch the notes.");
        setNotes([]);
        console.error(error);
      } else {
        setNotes(data);
        setFetchErrors(null);
      }

       console.log("Data:", data);
  console.log("Error:", error);
    };

    fetchNotes();
  }, []);



  const chunkedNotes = useMemo(() => ChunkArray(notes, 3), [notes]);

    if (loading){
     return <Loading/>;
  }
  return (
    <>
      <div className="headerBackground">
        <Container>
          <div>
            {message && alerts && (
              <Alert variant="success" onClose={closeAlerts} dismissible>
                <Alert.Heading>Congratulations!</Alert.Heading>
                <p>Your new note is created!</p>
              </Alert>
            )}
          </div>
          <div>
               {message2 && deleteAlerts && (
               <Alert variant="danger" onClose={closeDeleteAlerts} dismissible>
                <Alert.Heading>Attention!</Alert.Heading>
                <p>Your note is deleted!</p>
              </Alert>
            )}
          </div>

          <h5 className="p-2" style={{ fontFamily: "League Spartan", color: "white" }}>
            My Notes
          </h5>

          {fetchError && <p style={{ color: "red" }}>{fetchError}</p>}

          {chunkedNotes.map((noteGroup, rowIndex) => (
            <Row xs={1} md={3} className="g-4 p-1" key={rowIndex}>
              {noteGroup.map((note) => (
                <Col key={note.id || `${rowIndex}-${note.title}`}>
                  <Cards1 note={note} />
                </Col>
              ))}
            </Row>
          ))}
        </Container>
      </div>
    </>
  );
}

export default Header;
