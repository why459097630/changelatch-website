type SupabaseUser = {
  email?: string | null;
};

type SupabaseSession = {
  user: SupabaseUser | null;
};

type SupabaseAuth = {
  getUser(): Promise<{
    data: {
      user: SupabaseUser | null;
    };
    error: Error | null;
  }>;

  onAuthStateChange(
    callback: (
      event: string,
      session: SupabaseSession | null,
    ) => void,
  ): {
    data: {
      subscription: {
        unsubscribe(): void;
      };
    };
  };

  signInWithOAuth(options: unknown): Promise<{
    error: Error | null;
  }>;

  signOut(): Promise<{
    error: Error | null;
  }>;
};

type SupabaseClient = {
  auth: SupabaseAuth;
};

export function createClient(): SupabaseClient {
  return {
    auth: {
      async getUser() {
        return {
          data: {
            user: null,
          },
          error: null,
        };
      },

      onAuthStateChange(callback) {
        callback("INITIAL_SESSION", null);

        return {
          data: {
            subscription: {
              unsubscribe() {},
            },
          },
        };
      },

      async signInWithOAuth() {
        return {
          error: null,
        };
      },

      async signOut() {
        return {
          error: null,
        };
      },
    },
  };
}