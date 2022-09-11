const puppeteer = require("puppeteer");
require("dotenv").config();

const url = "https://www.instagram.com/";

// await, attend que chaque ligne se termine
(async () => {
  const browser = await puppeteer.launch({ headless: false }); // lancer un navigateur
  const page = await browser.newPage(); // créer une page
  await page.goto(url, { waitUntil: "networkidle2" }); // va à l'url

  // cookie
  await page.click(".bIiDR");

  // login
  await page.type("[name=username]", process.env.INSTA_PSEUDO, { delay: 100 });
  await page.type("[name=password]", process.env.INSTA_PASS, { delay: 100 });

  await page.click("button[type=submit]");

  // auto connect // waitForSel.. attendre le chargement de la page
  await page.waitForSelector(".cmbtv > button", { visible: true });
  await page.click(".cmbtv > button");

  // notif
  await page.waitForSelector("._a9-z > button", { visible: true });
  await page.click("._a9-z > button");

  debugger;
  //   await browser.close();
})(); // () fonction qui se joue toute seule
