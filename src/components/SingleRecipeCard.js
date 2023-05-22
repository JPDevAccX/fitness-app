import "./css/recipeCard.scss"

import { Card, Button } from 'react-bootstrap'
import { useState, useEffect } from 'react';

import RecipeModal from './RecipeModal';
import FoodAPIClient from "../services/API/foodApiService";
import { ReactComponent as Heart } from "../images/heart.svg"
import { ReactComponent as Redheart } from "../images/redheart.svg"


function SingleRecipeCard(props) {

    const foodAPIClient = new FoodAPIClient(props.viewCommon.net);

    const [heartIsRed, setHeartIsRed] = useState(false)

    useEffect(() => {
        const checkIfRecipeIsSaved = async () => {
            const data = await foodAPIClient.checkRecipe(props.id)
            setHeartIsRed(data)
        }
        checkIfRecipeIsSaved()
    }, [])

    const changeUserRecipes = async () => {
        const data = await foodAPIClient.getUserRecipes()
        if (props.changeSavedRecipes) props.changeSavedRecipes(data)
    }

    const [lgShow, setLgShow] = useState(false);

    async function handleClickedRecipe() {

        heartIsRed ? setHeartIsRed(false) : setHeartIsRed(true)

        const recipeParams = {
            title: props.title,
            id: props.id,
            imgUrl: props.imgUrl
        }
        await saveRecipeToDatabase(recipeParams)
        changeUserRecipes()
    }

    async function handleCardClick() {
        const recipeInfo = await foodAPIClient.getFullRecipe(props.id)
        const ingredientsList = recipeInfo.extendedIngredients.map((ingredient) => {
            return ingredient.original
        })

        const ingredientsImages = recipeInfo.extendedIngredients.map((ingredient) => {
            return [ingredient.image, ingredient.amount + " " + ingredient.unit]
        })

        const ingredientsValues = recipeInfo.extendedIngredients.map((ingredient) => {
            return [ingredient.name, ingredient.amount, ingredient.unit]
        })

        props.changeCurrentRecipe({
            title: recipeInfo.title,
            ingredients: ingredientsList,
            instructions: recipeInfo.instructions,
            image: recipeInfo.image,
            ingredientsImages: ingredientsImages,
            ingredientsValues: ingredientsValues
        })
        setLgShow(true)
    }

    async function saveRecipeToDatabase(params) {
        await foodAPIClient.addRecipe({
            title: params.title,
            id: params.id,
            imageUrl: params.imgUrl
        });
    }

    return (

        <>
            <Card className='recipe-card' style={{ width: '18rem' }}>
                <Card.Img onClick={handleCardClick} variant="top" src={props.imgUrl} />
                <Card.Body>
                    <Card.Title>{props.title}</Card.Title>
                    <Card.Text>
                        <Heart className={heartIsRed ? "d-none" : "d-block"}
                            onClick={handleClickedRecipe}
                        />
                        <Redheart className={heartIsRed ? "d-block" : "d-none"}
                            onClick={handleClickedRecipe}
                        />
                    </Card.Text>
                </Card.Body>
            </Card>
            <RecipeModal
                ingredient={props.ingredient}
                changeIngredient={props.changeIngredient}
                searchBarValues={props.searchBarValues}
                changeSearchBarValues={props.changeSearchBarValues}
                currentRecipe={props.currentRecipe}
                size="lg"
                show={lgShow}
                onHide={() => setLgShow(false)}
                aria-labelledby="example-modal-sizes-title-lg"
            />
        </>
    )
}

export default SingleRecipeCard