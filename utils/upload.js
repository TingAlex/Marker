const Static = require("../StaticInfo");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");

const { session } = require("electron");

const getCookie = () => {
  return new Promise((resolve, reject) => {
    session.defaultSession.cookies.get({}, (error, cookies) => {
      console.log("let's see cookie: ");
      if (error) {
        reject(error);
      } else {
        resolve(cookies);
      }
    });
  });
};

export const fransferArticle = async articleId => {
  let articlePath = path.join(Static.ARTICLE_FOLDER, articleId);
  let filesRelatedPath = [];
  filesRelatedPath = fs.readdirSync(articlePath);
  const form = new FormData();
  filesRelatedPath.forEach((fileRelaPath, index) => {
    let file = fs.createReadStream(path.join(articlePath, fileRelaPath));
    form.append("userFiles", file);
  });
  let cookiesArr = await getCookie();
  let expressCookie = cookiesArr[0];
  let expressSigCookie = cookiesArr[1];
  return new Promise((resolve, reject) => {
    form.submit(
      {
        host: Static.UPLOAD_TARGET_LINK.host,
        port: Static.UPLOAD_TARGET_LINK.port,
        path: Static.UPLOAD_TARGET_LINK.path + articleId,
        headers: {
          Cookie: `${expressCookie.name}=${expressCookie.value};domain=${
            expressCookie.domain
          };hostOnly=${expressCookie.hostOnly};path=${
            expressCookie.path
          };secure=${expressCookie.secure};httpOnly=${
            expressCookie.httpOnly
          };session=${expressCookie.session};expirationDate=${
            expressCookie.expirationDate
          };${expressSigCookie.name}=${expressSigCookie.value};domain=${
            expressSigCookie.domain
          };hostOnly=${expressSigCookie.hostOnly};path=${
            expressSigCookie.path
          };secure=${expressSigCookie.secure};httpOnly=${
            expressSigCookie.httpOnly
          };session=${expressSigCookie.session};expirationDate=${
            expressSigCookie.expirationDate
          }`
        }
      },
      function(err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      }
    );
  });
};

// fransferArticle("a8acdc3c-b577-4fb7-a197-adf2244169d8");

// let expressCookie = {
//   name: "express:sess",
//   value: "eyJwYXNzcG9ydCI6eyJ1c2VyIjoiNWNkNTYxMDE0ZWFhYTgzZDU0Nzc0NmVmIn19",
//   domain: "localhost",
//   hostOnly: true,
//   path: "/",
//   secure: false,
//   httpOnly: true,
//   session: false,
//   expirationDate: 1560087113.822843
// };
// let expressSigCookie = {
//   name: "express:sess.sig",
//   value: "pn7YvSwGS1RRxlDmQQN45Qrbzwo",
//   domain: "localhost",
//   hostOnly: true,
//   path: "/",
//   secure: false,
//   httpOnly: true,
//   session: false,
//   expirationDate: 1560122157.586092
// };

// var file = fs.createReadStream(
//   path.join(
//     Static.ARTICLE_FOLDER,
//     "a8acdc3c-b577-4fb7-a197-adf2244169d8",
//     "8b97e49a-fe0a-4a32-bf96-2094ad78988e.png"
//   )
// );

// form.append("userFiles", file, file.name);
// form.submit("http://localhost:5000/upload", function(err, res) {
//   console.log(res);
// });

// var options = {
//   method: "POST",
//   host: "localhost:5000",
//   path:"/upload",
//   headers:form.getHeaders(),
//   formData: {
//     img: {
//       value: file
//     }
//   }
// };

// var request=http.request(options, function(error, response, body) {
//   if (!error && response.statusCode == 200) {
//     console.log(body);
//   } else {
//     console.log(err);
//     console.log(response);
//   }
// });

// const req = http.request(
//   {
//     host: "127.0.0.1",
//     port: 5000,
//     method: "POST"
//   },
//   res => {
//     res.resume();
//     res.on("end", () => {
//       if (!res.complete)
//         console.error(
//           "The connection was terminated while the message was still being sent"
//         );
//     });
//   }
// );
