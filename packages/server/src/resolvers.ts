import { GraphQLUpload } from 'graphql-upload';
import { postMutations } from './resolvers/mutations/post.mutation';
import { userMutations } from './resolvers/mutations/user.mutation';
import { postQueries } from './resolvers/queries/post.query';
import { userQueries } from './resolvers/queries/user.query';
import TypeDefinitions from './resolvers/typeDefinitions';

export default {
  Query: {
    ...userQueries,
    ...postQueries
  },
  Mutation: {
    ...userMutations,
    ...postMutations
  },
  Upload: GraphQLUpload,
  ...TypeDefinitions
};
