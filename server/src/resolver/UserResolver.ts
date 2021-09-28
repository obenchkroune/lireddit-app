import { User } from '../entity/User';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { getRepository } from 'typeorm';
import { UserResponse, UsernamePasswordInput } from '../types';
import { validateUserInput } from '../utils/helpers';
import Argon2 from 'argon2';
import { MyContext } from 'src/types/MyContext';

@Resolver()
export class UserResolver {
  private userRepo = getRepository(User);

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext): Promise<User | null> {
    if (!req.session.userId) return null;
    const user = await this.userRepo.findOne(req.session.userId);
    return user!;
  }

  @Query(() => [User])
  async allUsers(): Promise<User[]> {
    return await this.userRepo.find({});
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') { username, password }: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateUserInput({ username, password });

    if ((await this.userRepo.findOne({ username })) !== undefined) {
      errors.push({
        field: 'username',
        message: 'username taken by another user.',
      });
    }

    if (errors.length === 0) {
      const user = this.userRepo.create({
        username,
        password: await Argon2.hash(password),
      });
      await this.userRepo.save(user);

      req.session.userId = user.id;
      return { user };
    } else {
      return { errors };
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') { username, password }: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await this.userRepo.findOne({ username });
    if (
      user === undefined ||
      !(await Argon2.verify(user?.password, password))
    ) {
      return {
        errors: [
          {
            field: 'password',
            message: 'incorrect username or password.',
          },
        ],
      };
    } else {
      req.session.userId = user.id;

      return { user };
    }
  }
}
