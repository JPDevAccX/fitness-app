import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ExerciseAPIClient from "../services/API/exerciseApiService";
import "./css/exercises.scss";
import logo from "../images/logo.png";
import top from "../images/top.png";
import WorkoutCard from "../components/WorkoutCard";

function Exercises(props) {
  const exerciseAPIClient = new ExerciseAPIClient(props.viewCommon.net);

  const [bodyparts, setBodyparts] = useState(null);
  const [worksoutsForBodyPart, setWorksoutsForBodyPart] = useState(null);
  const [numToShow, setNumToShow] = useState(10);

  useEffect(() => {
    async function getBodyparts() {
      const data = await exerciseAPIClient.getBodyparts();
      setBodyparts(data || []);
    }
    getBodyparts();
  }, []);

  useEffect(() => {
    setNumToShow(10);
  }, [worksoutsForBodyPart]);

  const handleCardClick = async (bp) => {
    const data = await exerciseAPIClient.getExercise(bp);

    setWorksoutsForBodyPart(data);
  };

  const handleLoadMore = () => {
    setNumToShow(numToShow + 10);
  };

  return (
		<>
			<h1 className="page-title">Exercises</h1>
			<div className="component-single-workout-card">
				<div className="card-container">
					{bodyparts && 
					bodyparts.map((bp) => (
						<Card key={bp} className="card"	onClick={() => handleCardClick(bp)}>
							<Card.Body>
								<Card.Title className="card-title">
									<img src={logo} alt="Logo" className="logo" />
									<h2>{props.name}</h2>
								</Card.Title>
								<Card.Text>{bp}</Card.Text>
							</Card.Body>
						</Card>
					))
				}
				</div>
				<>
					{worksoutsForBodyPart && (
						<div className="card-container-2">
							{worksoutsForBodyPart.slice(0, numToShow).map((exercise) => {
								return (
									<WorkoutCard
										key={exercise.id}
										title={exercise.name}
										imgUrl={exercise.gifUrl}
										equiment={exercise.equipment}
										part={exercise.bodyPart}
										target={exercise.target}
									/>
								);
							})}
						</div>
					)}
				</>

				{worksoutsForBodyPart && numToShow >= 20 && (
					<button
						className="scroll-to-top-btn"
						onClick={() => window.scrollTo(0, 0)}
					>
						<img src={top} className="top" />
					</button>
				)}

				{worksoutsForBodyPart && numToShow < worksoutsForBodyPart.length && (
					<Button
						className="load-more-btn"
						variant="primary"
						onClick={handleLoadMore}
					>
						Load More
					</Button>
				)}
			</div>
		</>
  );
}

export default Exercises;