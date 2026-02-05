export interface UserMetadata {
  clerk_id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface User extends UserMetadata {
  _id: string;
  classes: string[];
  created_at: string;
  last_login: string;
}