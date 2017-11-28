import * as React from 'react';

const commentsEndpoint = 'https://a4hzf96mfg.execute-api.eu-west-2.amazonaws.com/prod/comments';

interface Comment {
  commentId: string;
  message: string;
  userName: string;
}

interface CommentContainerProps extends Comment {

}
class CommentContainer extends React.Component<CommentContainerProps> {
  render() {
    return (
      <div>
        {this.props.userName}: {this.props.message}
      </div>
    );
  }
}

interface PageLocalState {
  comments: Comment[];
}
interface PageProps {
  id: string;
}
class Page extends React.Component<PageProps, PageLocalState> {
  constructor(props: PageProps) {
    super(props);
    this.state = {
      comments: [],
    };
    fetch(commentsEndpoint + '/' + this.props.id, {
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }),
      method: 'GET'
    })
    .then((res) => res.json())
    .then((json) => this.setState((state) => ({comments: json.comments})));
  }

  render() {
    return (
      <div>
        {this.state.comments.map((comment) =>
          <CommentContainer key={comment.commentId} {...comment} />)}
      </div>
    );
  }
}

interface AppLocalState {
  currentPageId: string;
}
class App extends React.Component<{}, AppLocalState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      currentPageId: 'index',
    };
  }

  render() {
    return (
      <Page id={this.state.currentPageId} />
    );
  }
}

export default App;
