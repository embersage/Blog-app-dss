interface IPost {
  id: string;
  title: string;
  text: string;
  views: number;
  image: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
  };
}

export default IPost;
