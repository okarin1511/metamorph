export interface User {
  id: string;
  name: string;
  email: string;
}

const mockUsers: User[] = [
  { id: '1', name: 'Alice Smith', email: 'alice@example.com' },
  { id: '2', name: 'Bob Jones', email: 'bob@example.com' },
];

export class UserService {
  public getAllUsers(): User[] {
    return [...mockUsers];
  }

  public getUserById(id: string): User | undefined {
    return mockUsers.find((u) => u.id === id);
  }
}
