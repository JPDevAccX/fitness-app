import "../components/css/recipeCard.scss"
import SingleRecipeCard from '../components/SingleRecipeCard'
import FoodAPIClient from "../services/API/foodApiService"
import { Button, Col, Row, Form } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import NutritionModal from '../components/NutritionModal'

function Recipes(props) {

    const foodAPIClient = new FoodAPIClient(props.viewCommon.net);

		const [isRedHeart, changeIsRedHeart] = useState(false);

		const [searchBarValues, changeSearchBarValues] = useState({
			ingredient: "",
			amount: "",
			unit: "",
		});

		const [recipes, changeRecipes] = useState([]);
		const [currentRecipe, changeCurrentRecipe] = useState(null) ;
    const [lgShow, setLgShow] = useState(false);

    const [nutrition, changeNutrition] = useState([{
        name: "Calcium",
        amount: "1",
        unit: "mg",
    }]);

    const [ingredient, changeIngredient] = useState({
        name: "Milk",
        amount: 0,
        unit: "g",
    });

    async function getRecipes(requestData) {
        const data = await foodAPIClient.getRecipe(requestData);

        if (data.results.length === 0) {
            props.changeErrorMessage("No recipes found")
            return
        }
        return changeRecipes(data.results)
    }

    useEffect(() => {
        foodAPIClient.getAllRecipes()
            .then(data => {
                changeRecipes(data)
            })
            .catch(error => {
                console.log(error)
            })
    }, [])

    const showRecipes = recipes.map((recipe) => {
        // THE MOST CLEVER LINE OF CODE I HAVE EVER WRITTEN  // DIFFERENT API'S HAVE DIFFERENT KEY NAMES FOR THE SAME THING // 
        if (!recipe.image) { recipe.image = recipe.imageUrl }
        return (
            <SingleRecipeCard
                key={recipe.id}
                title={recipe.title}
                id={recipe.id}
                imgUrl={recipe.image}
                viewCommon={props.viewCommon}
                currentRecipe={currentRecipe}
                changeCurrentRecipe={changeCurrentRecipe}
                saveRecipeToDatabase={saveRecipeToDatabase}
                isRedHeart={isRedHeart}
                changeIsRedHeart={changeIsRedHeart}
                searchBarValues={searchBarValues}
                changeSearchBarValues={changeSearchBarValues}
            />
        )
    })


    async function saveRecipeToDatabase(params) {
        foodAPIClient.addRecipe({
            title: params.title,
            id: params.id,
            imageUrl: params.imgUrl
        });
    }

    function submitHandlerRecipe(event) {
        event.preventDefault();
        const data = event.target[0].value;
        if (data === "") {
            props.changeErrorMessage("Please enter name of recipe")
            return
        }
        try {
            getRecipes(data);
        } catch (error) { console.log(error) }
    }

    const getNutrition = async (data, amount, unit) => {
        return await foodAPIClient.getIngredientInfo(data, amount, unit);
    }

    const getID = async (requestData) => {
        const data = await foodAPIClient.getIngredientID(requestData);
        if (data.results.length === 0) {
            return "Ingredient not found"
        }
        return data.results[0].id
    }

    async function submitHandlerNutrition(event) {
        event.preventDefault();

        const data = event.target[0].value;
        const amount = event.target[1].value;

        if (data === "") {
            props.changeErrorMessage("Please enter name of ingredient")
            return
        }

        const unit = event.target[2].value || "unit";
        const id = await getID(data);

        if (id === "Ingredient not found") {
            props.changeErrorMessage("Ingredient not found")
            return
        } else if (amount === "" || isNaN(amount)) {
            props.changeErrorMessage("Please enter a valid amount")
            return
        }
        try {
            const nutrition = await getNutrition(id, amount, unit);
            changeNutrition(nutrition.nutrition.nutrients)
            changeIngredient({
                name: data,
                amount: amount,
                unit: unit,
            })
            setLgShow(true);
        } catch (error) { console.log(error) }
    }

    return (
        <>
            <Row lg={12} className="the-row">
                <Col lg={3} md={12} className="search-column search-one">
                    <Form onSubmit={submitHandlerRecipe} >
                        <Form.Group >
                            <Form.Control type="text" placeholder="Enter name of food" />
                        </Form.Group>
                        <br />
                        <Button className="orange-button" variant="primary" type="submit">Fetch recipes!</Button>
                    </Form>
                    <br />
                    <br />
                    <br />
                    <Form onSubmit={submitHandlerNutrition}>
                        <Form.Group >
                            <Form.Control defaultValue={searchBarValues.ingredient} id="name" type="text" placeholder="Enter ingredient name" />
                        </Form.Group>
                        <br />
                        <Form.Group >
                            <Form.Control defaultValue={searchBarValues.amount} id="amount" type="text" placeholder="Enter amount" />
                        </Form.Group>
                        <br />
                        <Form.Group >
                            <Form.Control defaultValue={searchBarValues.unit} id="unit" type="text" placeholder="Enter weight unit" />
                        </Form.Group>
                        <br />
                        <Button className="orange-button" variant="primary" type="submit">Fetch nutrition!</Button>
                    </Form>
                    <NutritionModal
                        ingredient={ingredient}
                        nutrition={nutrition}
                        size="lg"
                        show={lgShow}
                        onHide={() => setLgShow(false)}
                        aria-labelledby="example-modal-sizes-title-lg"
                    />
                </Col>
                <Col lg={9} md={12} className="search-column">
                    <div className="recipe-wrapper">
                        {showRecipes}
                    </div>
                </Col>
            </Row>
        </>
    )
}

export default Recipes