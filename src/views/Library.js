import './css/library.scss'
import { Card } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import FoodAPIClient from '../services/API/foodApiService'
import ExerciseAPIClient from '../services/API/exerciseApiService'
import SingleRecipeCard from '../components/SingleRecipeCard'
import { useNavigate } from 'react-router-dom'

function Library(props) {

    const navigate = useNavigate();

    const foodAPIClient = new FoodAPIClient(props.viewCommon.net);
    const exerciseAPIClient = new ExerciseAPIClient(props.viewCommon.net);

		const [savedRecipes, changeSavedRecipes] = useState([]);
		const [currentRecipe, changeCurrentRecipe] = useState(null) ;
    const [savedWorkouts, changeSavedWorkouts] = useState([]);

    useEffect(() => {
        const getUserRecipes = async () => {
            const data = await foodAPIClient.getUserRecipes()
            changeSavedRecipes(data)
        }
        const getUserWorkouts = async () => {
            const workouts = await exerciseAPIClient.getCustomWorkoutForUser()
            changeSavedWorkouts([...workouts])
        }
        getUserRecipes()
        getUserWorkouts()
    }, [])

    const showRecipes = () => {
        return savedRecipes?.map((recipe) =>
            <SingleRecipeCard
                key={recipe._id}
                title={recipe.title}
                id={recipe.id}
                imgUrl={recipe.imageUrl}
                viewCommon={props.viewCommon}
                currentRecipe={currentRecipe}
								changeCurrentRecipe={changeCurrentRecipe}
								changeSavedRecipes={changeSavedRecipes}
            />
        )
    }

    const showWorkoutPage = (workout) => {
        props.changeCurrentCustomWorkout(workout)
        navigate('/custompage')
    }

    const showWorkouts = () => {
        return savedWorkouts?.map((workout, index) =>
            <Card key={index} onClick={() => showWorkoutPage(workout)} className='recipe-card'>
                <Card.Img variant="top" src={workout.image} />
                <Card.Body>
                    <Card.Title>{workout.title}</Card.Title>
                    <Card.Text>
                    </Card.Text>
                </Card.Body>
            </Card>
        )
    }

    return (
        <div className="page-library">
					<h1 className="page-title">Library</h1>
            <h1>My recipes</h1>
            <div className='recipe-wrapper' >
                {showRecipes()}
            </div>
            <h1>My workouts</h1>
            <div className='recipe-wrapper'>
                {showWorkouts()}
            </div>
        </div>
    )
}

export default Library