import { Request, Response } from 'express';
import { UserService } from '../services/user.service.js';

const userService = new UserService();

export class UserController {
  public getUsers(_req: Request, res: Response): void {
    const users = userService.getAllUsers();
    res.json(users);
  }

  public getUserById(req: Request, res: Response): void {
    const user = userService.getUserById(req.params.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  }
}
