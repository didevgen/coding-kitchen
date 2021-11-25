import { makeVar } from '@apollo/client';

export const currentUserGlobal = makeVar(null);

export const typePolicies = {
  Query: {
    fields: {
      currentUser: {
        read() {
          return currentUserGlobal();
        }
      }
    }
  }
};
