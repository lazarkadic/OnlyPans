import PropTypes from 'prop-types'

const User = ({name, email, pass}) => {
  return (
    <tr>
      <td>{name}</td>
      <td>{email}</td>
      <td>{pass}</td>
    </tr>
  )
}

User.defaultProps = {
  name: 'First Name',
  email: 'Email',
  pass: 'Password'
}

User.propTypes = {
  name: PropTypes.string,
  email: PropTypes.string,
  pass: PropTypes.string
}

export default User