interface BaseCommentOperations {
  addComment(): void;
}

export class PostService implements BaseCommentOperations {
  public addComment(): void {
    console.log('left');
  }
}
