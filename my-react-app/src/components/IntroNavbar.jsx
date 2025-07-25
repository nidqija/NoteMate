import { Navbar } from "react-bootstrap";
import { Nav } from "react-bootstrap";
import { Container } from "react-bootstrap";
import { GiPenguin } from "react-icons/gi";

function Navbar01(){
    return(
         <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/home" style={{fontFamily :'Hanken Grotesk' , fontWeight :'600'}}><GiPenguin style={{fontWeight :'600'}}/> NoteMate!</Navbar.Brand>
       
        <Nav className="justify-content-end " activeKey="/home">
        <Nav.Item>
          <Nav.Link className="mx-3" href="/home">Home</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="mx-3" eventKey="link-1">About Us</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="mx-3" eventKey="link-2">Get Started</Nav.Link>
        </Nav.Item>
      
      </Nav>
      </Container>
    </Navbar>
    )
}


export default Navbar01; 