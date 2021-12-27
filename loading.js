import React from "react";
import ReactDOMServer from "react-dom/server";
import fs from "fs";
import Header from "./src/components/Header";
import Footer from "./src/components/Footer";
import Loading from "./src/components/Loading";
import { StateContext } from "./src/context";
import { StaticRouter } from "react-router-dom/server";

function Shell() {
  return (
    <StateContext.Provider value={{ loggedIn: false }}>
      <StaticRouter>
        <Header staticRender={true} />
        <div className="py-5 my-5 text-center">
          concurrently
          <Loading />
        </div>
        <Footer />
      </StaticRouter>
    </StateContext.Provider>
  );
}

function html(x) {
  return `
    <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Web site created using create-react-app" />
    <link href="https://fonts.googleapis.com/css?family=Public+Sans:300,400,400i,700,700i&display=swap" rel="stylesheet" />
    <link
      rel="stylesheet"
      href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
      integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
      crossorigin="anonymous"
    />
    <script
      defer
      src="https://use.fontawesome.com/releases/v5.5.0/js/all.js"
      integrity="sha384-GqVMZRt5Gn7tB9D9q7ONtcp4gtHIUEW/yG7h98J7IpE3kpi+srfFyyB/04OV6pG0"
      crossorigin="anonymous"
    ></script>
    <title>CApp-react</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root">${x}</div>
  </body>
</html>
    `;
}

const renderToHTML = ReactDOMServer.renderToString(<Shell />);

const overAllHTML = html(renderToHTML);

const filename = "./public/index.html";
const stream = fs.createWriteStream(filename);
stream.once("open", () => {
  stream.end(overAllHTML);
});
