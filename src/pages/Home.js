import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import NavBar from '../components/Navbar';
import TableComp from '../components/TableComp';


function Home({ users, query, setQuery, handleSubmit }) {
  return (
    <>
    <NavBar
      query={query}
      setQuery={setQuery}
      handleSubmit={handleSubmit}
    />
    <Link to='/'>Authentication</Link>
    <Button onClick={()=>{alert("Nesto smo napisali")}}>BS5 button</Button>
    <TableComp users={users}></TableComp>
    </>
  )
}

export default Home