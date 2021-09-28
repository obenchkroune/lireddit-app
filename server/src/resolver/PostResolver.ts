import { Post } from '../entity/Post';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { getRepository } from 'typeorm';

@Resolver()
export class PostResolver {
  private postRepo = getRepository(Post);

  @Query(() => [Post])
  async allPosts(): Promise<Post[]> {
    return await this.postRepo.find({});
  }

  @Mutation(() => Post)
  async createPost(@Arg('title') title: string) {
    const post = this.postRepo.create({ title });
    return await this.postRepo.save(post);
  }

  @Mutation(() => Boolean, { nullable: true })
  async deletePost(@Arg('id') id: number): Promise<boolean> {
    try {
      await this.postRepo.delete(id);
      return true;
    } catch {
      return false;
    }
  }
}
