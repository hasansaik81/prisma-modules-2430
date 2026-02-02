import cors from "cors";
import express, { Application } from "express";
import { toNodeHandler } from "better-auth/node";

import { postRouter } from "./modules/post/post.router";
import { auth } from "./lib/auth";
import { commentRouter } from "./modules/comment/comment.router";

const app: Application = express();


// app.use(cors({
//   origin: "*"
// }));
app.use(cors({
  origin:process.env.APP_URL|| "http://localhost:4-000",
// //   //  origin: [
// //   //     'http://localhost:3000',
// //   //     'http://localhost:4000'
// //   //   ],
  credentials: true
}));

// middleware
app.use(express.json());
// console.log("postRouter =", postRouter);
// app.all(/^\/api\/auth\/.*/, toNodeHandler(auth));
app.all("/api/auth/*splat", toNodeHandler(auth));



app.use("/posts",postRouter);
app.use("/comments",commentRouter);

app.get("/",(req,res)=>{
    res.send("Hello World :prisma is working");
});

export default app;




