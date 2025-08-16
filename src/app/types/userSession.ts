export type UserSession = {
  user: {
    name: string;
    email: string;
    image: string | undefined;
    id: number;
  }
}