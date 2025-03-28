// auth.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type { Provider } from 'next-auth/providers';

// Definindo tipos customizados para a sessão e token JWT
declare module 'next-auth' {
  interface User {
    accessToken?: string;
    refreshToken?: string;
  }
  
  interface Session {
    accessToken?: string;
    refreshToken?: string;
  }
}

interface UserData {
  id: number;
  name: string;
  email: string;
}

interface DjangoTokenResponse {
  access: string;
  refresh: string;
}

const providers: Provider[] = [
  Credentials({
    credentials: {
      email: { label: 'Email Address', type: 'email', placeholder: 'email@example.com' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials): Promise<any> {
      try {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e senha são obrigatórios');
        }
        // 1. Primeiro obtém os tokens JWT
        const tokenResponse = await fetch('http://workspace-backend:8000/api/token/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: credentials.email, // Django normalmente espera 'username'
            password: credentials.password,
          }),
        });

        const data: DjangoTokenResponse = await tokenResponse.json();

        if (!tokenResponse.ok) {
          // @ts-ignore
          throw new Error(data?.detail || 'Falha na autenticação');
        }

        // 2. Agora obtém os dados do usuário
        const userResponse = await fetch('http://workspace-backend:8000/api/user/me/', {
          headers: {
            'Authorization': `Bearer ${data.access}`,
          },
        });
    
        const userData: UserData = await userResponse.json();


        if (!userResponse.ok) {
          throw new Error('Falha ao obter dados do usuário');
        }

        return {
          id: userData.id, // Usando email como ID temporário
          email: userData.email,
          name: userData.name, // Você pode ajustar isso conforme seus dados
          accessToken: data.access,
          refreshToken: data.refresh,
        };

      } catch (error) {
        console.error('Authentication error:', error);
        return null;
      }
    },
  }),
];

export const providerMap = providers.map((provider) => {
  if (typeof provider === 'function') {
    const providerData = provider();
    console.log("pp", providerData)
    return { id: providerData.id, name: providerData.name };
  }
  return { id: provider.id, name: provider.name };
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      // Primeiro login
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      // Adiciona tokens à sessão
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      return session;
    },
    authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = !!session?.user;
      const isPublicPage = nextUrl.pathname.startsWith('/public');

      if (isPublicPage || isLoggedIn) {
        return true;
      }
      return false;
    },
  },
});