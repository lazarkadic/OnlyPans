import NavBar from "./Navbar"
import Table from "react-bootstrap/esm/Table"

function Recipes({ recipes }) {
  return (
    <>
    <NavBar></NavBar>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Ingredients</th>
          <th>Instructions</th>
          <th>Author</th>
          <th>Time</th>
          <th>Tags</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {recipes.map(recipe => (
        <tr key={recipe.id}>
            <td>{recipe.ingredients}</td>
            <td>{recipe.instructions}</td>
            <td>{recipe.author}</td>
            <td>{recipe.time}</td>
            <td>{recipe.tags}</td>
            <td>{recipe.description}</td>
        </tr>
      ))}
      </tbody>
    </Table>
    </>
  )
}

export default Recipes