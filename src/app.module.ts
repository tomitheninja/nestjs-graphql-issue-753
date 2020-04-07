import { Module } from '@nestjs/common';
import { GraphQLModule, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Resolver('app')
export class AppResolver {
  // @Subscription(() => String, { resolve: (x) => x }) // ✅
  @Subscription(() => String) // ❌
  onEvent() {
    return pubSub.asyncIterator('onEvent');
  }

  @Query(() => String)
  triggerEvent() {
    pubSub.publish('onEvent', 'subscription result');
    return 'query result';
  }
}

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug: true,
      playground: true,
      autoSchemaFile: true,
      installSubscriptionHandlers: true,
      context: ({ req }) => ({ req }),
    }),
  ],
  providers: [AppResolver],
})
export class AppModule {}
