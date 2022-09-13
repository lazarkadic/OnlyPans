import { useEffect, useState } from 'react';
import './App.css';

const defaultUser = { first_name: '', email: '', password: '' }

function App() {
  const [users, setUser] = useState([]);
  const [filter, setFilter] = useState('');
  const [newUser, setNewUser] = useState(defaultUser);
  const [newUserResponse, setNewUserResponse] = useState('');

  const addUser = async (e) => {
    e.preventDefault();

    const response = await fetch('https://functions-cloud1-onlypans.harperdbcloud.com/local-api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        operation: 'insert',
        schema: 'onlypans',
        table: 'user',
        records: [newUser]
      })
    });

    const result = await response.json();
    setNewUserResponse(result.message);
    setNewUser(defaultUser);
  }

  useEffect(() => {
    const getUsers = async() => {
      const response = await fetch(filter.length ? `https://functions-cloud1-onlypans.harperdbcloud.com/local-api/user/${filter}` : `https://functions-cloud1-onlypans.harperdbcloud.com/local-api/user`)
      const newUsers = await response.json();
      setUser(newUsers);
    }

    getUsers();
  }, [filter, newUserResponse]);

  return (
    <div className="App">
      <table className='column'>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Email</th>
            <th>Password</th>
          </tr>
        </thead>
        <tbody>
          {users.length ? users.map(user => {
            return <tr key={user.id}>
              <td>{user.first_name}</td>
              <td>{user.email}</td>
              <td>{user.password}</td>
            </tr>
          }) : (
            <tr>
              <td colSpan="3">No Users Found</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className='column'>
        <form>
          Filter Users: <input type="text" onChange={(e) => setFilter(e.currentTarget.value)} value={filter}></input>
        </form>
        <br />
        <hr />
        <br />
        <form>
          <table>
            <thead>
              <tr>
                <th>User Name</th>
                <th>User Email</th>
                <th>User Password</th>
              </tr>
            </thead>
            <tbody>
            <tr>
              <td>
                <input type="text" onChange={(e) => setNewUser({ ...newUser, first_name: e.currentTarget.value })} value={newUser.first_name} />
              </td>
              <td>
                <input type="text" onChange={(e) => setNewUser({ ...newUser, email: e.currentTarget.value })} value={newUser.email} />
              </td>
              <td>
                <input type="text" onChange={(e) => setNewUser({ ...newUser, password: e.currentTarget.value })} value={newUser.password} />
              </td>
              <td>
                <button onClick={addUser}>Add User</button>
              </td>
            </tr>
            </tbody>
          </table>
          <br />
          {newUserResponse}
        </form>
      </div>
    </div>
  );
}

export default App;
