import NextAuth from "next-auth";
import CryptoJS from "crypto-js";
import CredentialsProvider from "next-auth/providers/credentials";
import { console } from "next/dist/compiled/@edge-runtime/primitives";
import DB from "@/pages/utils/db";

export const authOptions = {
  providers: [
    CredentialsProvider({
      // 1. 로그인페이지 폼 자동생성해주는 코드
      name: "credentials",
      credentials: {
        id: { label: "id", type: "text" },
        password: { label: "password", type: "password" },
      },

      // 2. 로그인요청시 실행되는코드
      // 직접 DB에서 아이디,비번 비교하고
      // 아이디,비번 맞으면 return 결과, 틀리면 return null 해야함
      async authorize(credentials) {
        const { id, password } = credentials;

        const hashedPassword = CryptoJS.algo.HMAC.create(
          CryptoJS.algo.SHA256,
          process.env.HASH_KEY,
        )
          .update(password)
          .finalize()
          .toString(CryptoJS.enc.Hex);

        const db = DB();

        const user = await db("users")
          .where("id", id)
          .where("password", hashedPassword)
          .first();

        if (!user) {
          console.log("해당 유저 없음");
          return null;
        }
        console.log("있음", user);
        return user;
      },
    }),
  ],

  // //3. jwt 써놔야 잘됨. jwt 만료일설정
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1일
  },

  callbacks: {
    // 4. jwt 만들 때 실행되는 코드
    // user변수는 DB의 유저정보담겨있고 token.user에 뭐 저장하면 jwt에 들어갑니다.
    jwt: async ({ token, user }) => {
      // console.log("user info in jwt", token, user);
      if (user) {
        token.user = {};
        token.user.id = user.id;
      }
      return token;
    },
    // 5. 유저 세션이 조회될 때 마다 실행되는 코드
    session: async ({ session, token }) => {
      session.user = token.user;
      return session;
    },
  },

  secret: "tmpSecret", //! env에 넣기
  pages: {
    signIn: "/login",
  },
};
export default NextAuth(authOptions);
