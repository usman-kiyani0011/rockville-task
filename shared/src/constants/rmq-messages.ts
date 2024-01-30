export const RMQ_MESSAGES = {
  USER_ACCOUNT: {
    AUTH: {
      SIGNUP: 'auth-signup',
      SIGNIN: 'auth-signin',
      LOGOUT: 'auth-logout',
      CHANGE_PASSWORD: 'auth-change-password',
      VERIFY_TOKEN: 'auth-verify-token',
    },
    PROFILE: {
      GET_PROFILE: 'profile-get-profile',
      UPDATE_PROFILE: 'profile-update-profile',
    },
  },
  CATEGORY: {
    CATEGORY_SEEDS: 'category-seeds',
  },
  MOVIES: {
    LIST: 'movies-list',
    RECOMMENDED: 'movies-recommended',
    ADD_RATINGS: 'movies-add-rating',
    SEED: 'movies-seeds',
    DETAIL: 'movie-details',
  },
};
