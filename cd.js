const puppeteer = require("puppeteer");
const nodemailer = require("nodemailer");
require("dotenv").config();

const url = "https://www.boutiquele29.fr/product-page/mes-demoiselles-robe";

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // lancer un navigateur
  const page = await browser.newPage(); // créer une page
  await page.goto(url, { waitUntil: "networkidle2" }); // va à l'url

  await page.setViewport({
    width: 1200,
    height: 10000,
  });

  // pdf
  // await page.pdf({
  //   path: "page.pdf",
  //   format: "A4",
  // });

  // image
  // await page.screenshot({
  //   path: "image.png",
  // });

  // get <body>
  // let bodyHTML = await page.evaluate(() => document.body.innerHTML);
  // console.log(bodyHTML);

  let data = await page.evaluate(() => {
    return document.querySelector("span[data-hook=formatted-primary-price]")
      .innerHTML;
  });
  console.log("Le prix est de " + data);
  let newData = await data.substring(0, 6); // enlever les caractères inutiles, de 0 à 4

  // transformer string to number
  // quand tu es en dessous de 400, alors tu déclenches l'envoi d'un email
  if (parseInt(newData) < 400) {
    sendNotification(newData);
  }

  async function sendNotification(price) {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_OWNER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter
      .sendMail({
        from: '"PC le29" <monmail@gmail.com>',
        to: process.env.MAIL_TO,
        subject: "Prix sous les " + price + "€",
        html: "Le prix de la robe est de " + price + "€",
      })
      .then(() => console.log("Message envoyé"));
  }

  await browser.close();
})();
