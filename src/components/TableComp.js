import Table from 'react-bootstrap/Table';
import User from './User';

function TableComp({ users }) {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>First Name</th>
          <th>Email</th>
          <th>Password</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
        <User key={user.id} name={user.first_name} email={user.email} pass={user.password}></User>
      ))}
      </tbody>
    </Table>
  )
}

export default TableComp