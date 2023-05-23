import React from "react";
import Card from "react-bootstrap/Card";

const WorkoutCard = (props) => {
  return (
    <Card>
      <Card.Img variant="top" src={props.imgUrl} alt="Logo" />
      <Card.Body>
        <Card.Title>
        	{props.title}
        </Card.Title>
        <Card.Text as="div">
					Target <h4>{props.target}</h4>
					Body Part <h4>{props.part}</h4>
					Equipment <h4>{props.equiment}</h4>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default WorkoutCard;
