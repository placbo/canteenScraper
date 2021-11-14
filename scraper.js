const $ = require('cheerio');
const puppeteer = require('puppeteer');
const url = 'https://teknobyen.no/';
const fs = require('fs');
// const express = require('express');
// const app = express();
// const port = 3000;

const menus = [];

function splitDayMenu(menuAsString) {
    const menuItems = menuAsString.replace('1.', '').split('2.');
    return menuItems.map((menuItemString) => {
        const menuItem = menuItemString.split('A:');
        return {
            meal: menuItem[0] && (menuItem[0] = menuItem[0].replace(/"/g,'').trim()),
            allergens: menuItem[1] && (menuItem[1] = menuItem[1].replace(/"/g,'').trim())
        }
    })
}

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const pageContent = await page.content();

    $('.c-food-column', pageContent).each(function () {
        $('.c-food-table', this).each(function () {
            const menu = {};
            $('h3', this).each(function () {
                menu.canteen = $(this).text();
            });
            $('.day-1', this).each(function () {
                menu.day0 = splitDayMenu($(this).text());
            });
            $('.day-2', this).each(function () {
                menu.day1 = splitDayMenu($(this).text());
            });
            $('.day-3', this).each(function () {
                menu.day2 = splitDayMenu($(this).text());
            });
            $('.day-4', this).each(function () {
                menu.day3 = splitDayMenu($(this).text());
            });
            $('.day-5', this).each(function () {
                menu.day4 = splitDayMenu($(this).text());
            });
            menus.push(menu);
        });
    });

    //console.log(menus);
    fs.writeFileSync('this_week_menu.js', "data='" + JSON.stringify(menus) + "'");

    await browser.close();

    //
    // app.get('/', (req, res) => {
    //     res.send('<html><body><h1>Menus</h1></body></html>');
    // })
    //
    // app.listen(port, () => {
    //     console.log(`Example app listening at http://localhost:${port}`);
    // })

})();
