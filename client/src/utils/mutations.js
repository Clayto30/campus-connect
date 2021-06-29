import gql from 'graphql-tag';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const REACT_TO_MESSAGE = gql`
mutation reactToMessage($messageId: ID!, $content: String!) {
  reactToMessage(messageId: $messageId, content: $content) {
    _id
    reactionCount
      reactions {
        _id
        content
        createdAt
        username
      }
    }
  }
  }
}
`
export const SEND_MESSAGE = gql`
mutation sendMsg($to: String!, $msg: String!) {
  sendMsg(to: $to, msg: $msg) {
    _id
    from
    to
    msg
    createdAt
  }
}
`