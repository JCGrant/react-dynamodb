import * as React from 'react';

const commentsEndpoint = 'https://a4hzf96mfg.execute-api.eu-west-2.amazonaws.com/prod/comments';

const getComments = (pageId: string) => {
  return fetch(commentsEndpoint + '/' + pageId, {
    headers: new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }),
    method: 'GET'
  })
  .then((res) => res.json())
  .then((json) => json.comments);
};

const newComment = (message: string, pageId: string, userName?: string, ) => {
  return fetch(commentsEndpoint, {
    headers: new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }),
    method: 'POST',
    body: JSON.stringify({
      pageId,
      userName: userName || 'Anonymous',
      message,
    }),
  });
};

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
  newCommentText: string;
}
interface PageProps {
  id: string;
}
class Page extends React.Component<PageProps, PageLocalState> {
  constructor(props: PageProps) {
    super(props);
    this.state = {
      comments: [],
      newCommentText: '',
    };
    this.setComments();
  }

  setComments = () => {
    getComments(this.props.id)
    .then((comments) => this.setState((state) => ({comments})));
  }

  onChangeNewCommentInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCommentText = e.target.value;
    this.setState((state) => ({
      newCommentText,
    }));
  }

  onClickNewCommentButton = () => {
    if (this.state.newCommentText.length > 0) {
      newComment(this.state.newCommentText, this.props.id);
      this.setComments();
    }
  }

  render() {
    return (
      <div>
        <input
          value={this.state.newCommentText}
          onChange={this.onChangeNewCommentInput}
        />
        <button onClick={this.onClickNewCommentButton}>+</button>
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
